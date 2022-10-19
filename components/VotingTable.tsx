import { Badge, Table, Text } from '@mantine/core';
import { Application } from '../lib/interfaces';

type VotingTableProps = {
    //voteData: Application['steeringCommitteeReview'];
};

const data = [
    {
        name: 'Cameron Hogan',
        email: 'cameronh@email.com',
        vote: 'Pending',
        voteColor: 'gray',
    },
    {
        name: 'Craig Williams',
        email: 'cwilliams@email.com',
        vote: 'Approve',
        voteColor: 'green',
    },
    {
        name: 'Jane Doe',
        email: 'jane.doe@email.com',
        vote: 'Approve',
        voteColor: 'green',
    },
    {
        name: 'John Smith',
        email: 'john.smith@email.com',
        vote: 'Pending',
        voteColor: 'gray',
    },
    {
        name: 'Alexander Crocker',
        email: 'acrock@email.com',
        vote: 'Pending',
        voteColor: 'gray',
    },
    {
        name: 'Samuel Mackenzie',
        email: 'sam.mack@gmail.com',
        vote: 'Reject',
        voteColor: 'red',
    },
];

export default function VotingTable({}: VotingTableProps) {
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
                {data.map(vote => (
                    <tr key={vote.name}>
                        <td>
                            <Text size={'lg'}>{vote.name}</Text>
                        </td>
                        <td>
                            <Text size={'lg'}>{vote.email}</Text>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                            <Badge
                                color={vote.voteColor}
                                size="xl"
                                radius={'xs'}
                            >
                                {vote.vote}
                            </Badge>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}
