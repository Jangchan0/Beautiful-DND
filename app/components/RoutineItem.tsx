import Image from 'next/image';
import checkbox from '../../public/Checkbox.png';
import checkbox2 from '../../public/Checkbox2.png';
import { GroupTask } from '@/store/zustandStore';

export const RoutineItem = ({ item, deleteTask }) => {
    const handleDeleteTask = () => {
        deleteTask(item.id);
    };

    return (
        <div className="flex flex-col h-20 select-none">
            <h1>{item.title}</h1>
            <div className="flex">
                <p>{item.description}</p>
                <p className="mx-5">{item.time}</p>
                <button onClick={handleDeleteTask}>삭제</button>
                <Image src={item.completed ? checkbox2 : checkbox} alt="체크박스" width={20} height={20} />
            </div>
        </div>
    );
};
