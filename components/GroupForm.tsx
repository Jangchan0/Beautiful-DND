import { useForm } from 'react-hook-form';
import { AddRoutine } from './RoutineGroup';

export const GroupForm = ({ groupId, addTask }) => {
    const { register, handleSubmit, reset } = useForm<AddRoutine>();

    const handleAddTask = (data: AddRoutine) => {
        addTask(data, groupId);
        reset();
    };

    return (
        <form onSubmit={handleSubmit(handleAddTask)}>
            <input type="text" placeholder="new task" {...register('taskTitle')} className="text-black" />
            <button type="submit">add</button>
        </form>
    );
};
