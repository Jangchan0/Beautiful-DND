'use client';

import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useShallow } from 'zustand/react/shallow';
import { RoutineItem } from './RoutineItem';
import { useRoutineFunc } from '@/store/zustandStore';
import { AddGroup } from './AddGroup';
import { GroupForm } from './GroupForm';
import dot from '@/public/dot.png';
import Image from 'next/image';

export type AddRoutine = {
    taskTitle: string; // task 생성용
};
const RoutineGroup = () => {
    const { groups, setHandleRoutine, deleteGroup, addTask, deleteTask } = useRoutineFunc(
        useShallow((state) => ({
            groups: state.groups,
            setHandleRoutine: state.setHandleRoutine,
            deleteGroup: state.deleteGroup,
            addTask: state.addTask,
            deleteTask: state.deleteTask,
        }))
    );

    return (
        <div className="flex justify-center items-center flex-col h-screen">
            <h1 className="text-3xl ">My Routine</h1>
            <DragDropContext onDragEnd={setHandleRoutine}>
                {groups?.map((group) => (
                    <div key={group.id} className="my-5 bg-slate-600 rounded-md w-1/3">
                        <h1>{group.title}</h1>
                        <GroupForm groupId={group.id} addTask={addTask} />
                        {group.id !== 'default' && (
                            <button
                                onClick={() => {
                                    deleteGroup(group.id);
                                }}
                            >
                                삭제
                            </button>
                        )}
                        <Droppable key={group.id} droppableId={group.id}>
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps}>
                                    {group.tasks.map((item, index) => (
                                        <Draggable key={item.id} draggableId={item.id} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    className="flex justify-between "
                                                    style={{
                                                        backgroundColor: snapshot.isDragging ? 'lightgrey' : 'grey',
                                                        ...provided.draggableProps.style,
                                                    }}
                                                    ref={provided.innerRef}
                                                >
                                                    <RoutineItem key={item.id} item={item} deleteTask={deleteTask} />
                                                    <Image
                                                        src={dot}
                                                        alt="moveTask"
                                                        width={35}
                                                        height={20}
                                                        {...provided.dragHandleProps}
                                                        {...provided.draggableProps}
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                ))}
            </DragDropContext>
            <AddGroup />
        </div>
    );
};

export default RoutineGroup;
// 드래그 시 이미지 딸려오는 문제 해결해야함!
// 함수명 변수명 확인하기!
// 타입 지정 잘 되어있는지 확인하기!
// 최적화! (함수 내부 ? 연산자 사용, 삼항연산자 사용,return 안써도 되는 곳 확인, 함수코드 줄일 수 있는 곳 줄이기!, 재랜더링 컴포넌트 분리, 추상화 단계 맞추기)
// shallow 사용해서 꺼내오면 베리 굿!
