import React, { useState } from 'react';
import { Schedule } from '@/api/server/schedules/getServerSchedules';
import TaskDetailsModal from '@/components/server/schedules/TaskDetailsModal';
import Button from '@/components/elements/Button';
import tw from 'twin.macro';

interface Props {
    schedule: Schedule;
}

export default ({ schedule }: Props) => {
    const [ visible, setVisible ] = useState(false);

    return (
        <>
            {visible &&
            <TaskDetailsModal
                schedule={schedule}
                onDismissed={() => setVisible(false)}
            />
            }

            <Button className={'file-button-green'} onClick={() => setVisible(true)}>
                New Task
            </Button>
        </>
    );
};
