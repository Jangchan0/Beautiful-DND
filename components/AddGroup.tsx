import { useRoutineFunc } from '@/store/zustandStore';
import { useForm } from 'react-hook-form';
import { useShallow } from 'zustand/react/shallow';

export type AddGroupType = {
    groupTitle: string;
};

export const AddGroup = () => {
    const { register, handleSubmit, reset } = useForm<AddGroupType>();
    const { addGroup } = useRoutineFunc(
        useShallow((state) => ({
            addGroup: state.addGroup,
        }))
    );
    const handleAddGroup = (data: AddGroupType) => {
        addGroup(data);
        reset();
    };
    return (
        <form onSubmit={handleSubmit((data) => handleAddGroup(data))}>
            <input type="text" placeholder="New Group Name" className="text-black" {...register('groupTitle')} />
            <button type="submit">Add Group</button>
        </form>
    );
};
