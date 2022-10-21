import { Badge, Table, Text } from '@mantine/core';
import { Review } from '../lib/interfaces';
import { ApplicationReviewStatus } from '../lib/utilities/AppEnums';

type VotingTableProps = {
    voteData: Review[];
};

const voteColors: Map<ApplicationReviewStatus, string> = new Map([
    [ApplicationReviewStatus.Approved, 'green'],
    [ApplicationReviewStatus.Rejected, 'red'],
    [ApplicationReviewStatus.In_Review, 'gray'],
]);

export default function VotingTable({ voteData }: VotingTableProps) {
    return (
        <Table verticalSpacing="lg">
            <thead>
                <tr>
                    <th>
                        <Text size={'lg'}>Name</Text>
                    </th>
                    <th>
                        <Text size={'lg'}>Email</Text>
                    </th>
                    <th>
                        <Text size={'lg'} style={{ textAlign: 'center' }}>
                            Status
                        </Text>
                    </th>
                </tr>
            </thead>
            <tbody>
                {voteData.map(vote => (
                    <tr key={vote.name}>
                        <td>
                            <Text size={'lg'}>{vote.name}</Text>
                        </td>
                        <td>
                            <Text size={'lg'}>{vote.email}</Text>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                            <Badge
                                color={voteColors.get(vote.status)}
                                size="xl"
                                radius={'xs'}
                            >
                                {vote.status}
                            </Badge>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}
