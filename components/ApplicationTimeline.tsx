import { Timeline, Text } from '@mantine/core';
import { HistoryNode } from '../lib/interfaces';

type ApplicationTimeLineProps = {
    history: HistoryNode[];
};

function timeSince(date: Date) {
    const seconds = Math.floor(
        (new Date().getTime() - new Date(date).getTime()) / 1000,
    );

    const timeInSecondsMap: Map<string, number> = new Map([
        ['year', 31536000],
        ['month', 2592000],
        ['day', 86400],
        ['hour', 3600],
        ['minute', 60],
        ['second', 1],
    ]);

    for (const [timeFrame, timeInSeconds] of timeInSecondsMap) {
        const interval = seconds / timeInSeconds;
        if (interval > 1) {
            return (
                Math.floor(interval) +
                ' ' +
                timeFrame +
                (Math.floor(interval) > 1 ? 's' : '')
            );
        }
    }
}

export default function ApplicationTimeLine({
    history,
}: ApplicationTimeLineProps) {
    return (
        <Timeline align="right" active={1} m={20} style={{ height: '100%' }}>
            {history?.map((historyNode, i) => (
                <Timeline.Item
                    key={i}
                    title={historyNode.title}
                    bulletSize={24}
                >
                    <Text color="dimmed" size="sm">
                        {historyNode.description}
                    </Text>
                    <Text size="xs" mt={4}>
                        {timeSince(historyNode.timestamp)} ago
                    </Text>
                </Timeline.Item>
            ))}
        </Timeline>
    );
}
