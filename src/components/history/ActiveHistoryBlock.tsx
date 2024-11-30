import SlideDown from 'components/animations/SlideDown';
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
                    <SlideDown>
                        <HistoryEntry key={index} entry={entry} />
                    </SlideDown>
                );
            })}
        </div>
    );
};

ActiveHistoryBlock.displayName = 'HistoryBlock';

export default ActiveHistoryBlock;
