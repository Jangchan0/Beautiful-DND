import { AddGroupType } from '@/app/components/AddGroup';
import { AddRoutine } from '@/app/components/RoutineGroup';
import { DropResult } from 'react-beautiful-dnd';
import { create } from 'zustand';

interface RoutineInfoStoreState {
    groups: Group[];
}

export interface Group {
    id: string;
    title: string;
    tasks: GroupTask[];
}

export type GroupTask = {
    id: string;
    title: string;
    description: string;
    time: string;
    completed: boolean;
};

type DestinationSourceType = {
    droppableId: string;
    index: number;
};

type DraggableResponseType = {
    destination: DestinationSourceType;
    source: DestinationSourceType;
};

interface RoutineFunc {
    setHandleRoutine: (value: DropResult) => void;
    addGroup: (groupData: AddGroupType) => void;
    deleteGroup: (groupId: string) => void;
    addTask: (addTaskTitle: AddRoutine, groupId: string) => void;
    deleteTask: (taskId: string) => void;
}

export const useRoutineFunc = create<RoutineInfoStoreState & RoutineFunc>((set, get) => {
    const getGroupById = (groupId: string) => {
        const state = get();
        return state.groups.find((group) => group.id === groupId);
    };
    const updateGroupTasks = (groupId: string, tasks: GroupTask[]) => {
        set((state) => ({
            groups: state.groups.map((g) => (g.id === groupId ? { ...g, tasks } : g)),
        }));
    };
    return {
        groups: [
            {
                id: 'default',
                title: 'Default',
                tasks: [{ id: 'default', title: 'Default', description: 'Default', time: '09:30', completed: false }],
            },
        ],

        setHandleRoutine: (value: DropResult) => {
            if (!value.destination) return;
            const { source, destination } = value;
            const sourceGroup = getGroupById(source.droppableId);
            if (source.droppableId === destination.droppableId) {
                const items = Array.from(sourceGroup?.tasks || []);
                const [reorderedItem] = items.splice(source.index, 1); // 뽑아낸 task의 인덱스 뽑아내기
                items.splice(destination.index, 0, reorderedItem); // 도착 인덱스에 뽑아낸 task 추가!
                updateGroupTasks(source.droppableId, items);
            } else {
                const destGroup = getGroupById(destination.droppableId); // 도착지 그룹 복사!!
                const [movedItem] = sourceGroup?.tasks.splice(source.index, 1) ?? []; // 이동시킬 task 뽑아내기!
                destGroup?.tasks.splice(destination.index, 0, movedItem); // 도착지 그룹에 지정된 인덱스에 추가하기

                set((state) => ({
                    groups: state.groups,
                }));
            }
        },

        addGroup: (groupName) => {
            const state = get();
            // 같은 타이틀을 가진 그룹이 이미 있으면 추가되지 않도록 만들어야함.
            state.groups.some((group) => group.title === groupName.groupTitle)
                ? alert('같은 이름의 그룹이 이미 있습니다!')
                : set((state) => ({
                      groups: [...state.groups, { id: groupName.groupTitle, title: groupName.groupTitle, tasks: [] }],
                  }));
        },

        deleteGroup: (groupId) => {
            const deletedGroupTasks = getGroupById(groupId)?.tasks || [];
            set((state) => {
                const updatedGroups = state.groups.filter((group) => group.id !== groupId);
                const defaultGroupIndex = updatedGroups.findIndex((group) => group.title === 'Default');
                const defaultGroup = updatedGroups[defaultGroupIndex];
                const updatedDefaultGroup = {
                    ...defaultGroup,
                    tasks: [...defaultGroup.tasks, ...deletedGroupTasks],
                };
                updatedGroups.splice(defaultGroupIndex, 1, updatedDefaultGroup);
                return { groups: updatedGroups };
            });
        },

        addTask: (addTaskName, groupId) => {
            const taskName = addTaskName.taskTitle;
            const state = get();
            const groupIndex = state.groups.findIndex((group) => group.id === groupId);
            if (groupIndex === -1) return;

            // 동일한 taskName을 추가할 수 없도록 만들어야함.
            const isTaskExist = state.groups[groupIndex].tasks.some((task) => task.title === taskName);
            if (isTaskExist) {
                return alert('동일한 이름의 작업이 이미 있습니다!');
            }

            const newTask = { id: taskName, title: taskName, description: '', time: '09:30', completed: false };
            const updatedTasks = [...state.groups[groupIndex].tasks, newTask];

            set((state) => ({
                groups: state.groups.map((group, index) =>
                    index === groupIndex ? { ...group, tasks: updatedTasks } : group
                ),
            }));
        },
        deleteTask: (taskId: string) => {
            const state = get();
            const groupIndex = state.groups.findIndex((group) => group.tasks.some((task) => taskId === task.id));
            if (groupIndex === -1) return;
            const updatedTasks = state.groups[groupIndex].tasks.filter((task) => taskId !== task.id);
            set((state) => ({
                groups: state.groups.map((group, index) =>
                    index === groupIndex ? { ...group, tasks: updatedTasks } : group
                ),
            }));
        },
    };
});
