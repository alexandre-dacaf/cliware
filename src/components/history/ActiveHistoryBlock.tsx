import FadeIn from 'components/animations/FadeIn';
import HistoryEntry from 'components/history/HistoryEntry';
import { TerminalContext } from 'context/TerminalContext';
import { useContext } from 'react';
import './ActiveHistoryBlock.scss';

const ActiveHistoryBlock = () => {
    const { state } = useContext(TerminalContext);

    const activeBlock = state.printHistory.find(
        (group) => group.id === state.currentHistoryBlockId
    );

    if (!activeBlock) return null;

    return (
        <div className='active-history-block'>
            {activeBlock.entries.map((entry, index) => {
                return (
                    <FadeIn key={`active-history-entry${index}`}>
                        <HistoryEntry key={index} entry={entry} />
                    </FadeIn>
                );
            })}
        </div>
    );
};

ActiveHistoryBlock.displayName = 'HistoryBlock';

export default ActiveHistoryBlock;
