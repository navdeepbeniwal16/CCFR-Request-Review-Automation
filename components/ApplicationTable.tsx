import { Badge, Table, Button, Loader, Center, Text } from '@mantine/core';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Countdown from 'react-countdown';
import InfiniteScroll from 'react-infinite-scroll-component';
import TextTruncate from 'react-text-truncate';
import { Application } from '../lib/interfaces';



type ApplicationTableProps = {
    applications: Application[],
    fetchMoreData: () => void,
    numSteeringCommittee: number
}

type ApplicationRowProps = {
    application: Application,
    numSteeringCommittee: number,
}

export default function ApplicationTable({ applications, fetchMoreData, numSteeringCommittee }: ApplicationTableProps) {
    return (
        <InfiniteScroll
            dataLength={applications.length}
            next={fetchMoreData}
            hasMore={true}
            loader={<Center><Loader variant='dots' size='lg' /></Center>}
            endMessage={<p>End of list</p>}
        >
            <Table verticalSpacing="lg">
                <thead>
                    <tr>
                        <th style={{width: "30%"}}>Title</th>
                        <th style={{textAlign: "center"}}>Category</th>
                        <th>Investigator</th>
                        <th>Institution</th>
                        <th style={{textAlign: "center"}}>Date Added</th>
                        <th style={{textAlign: "center"}}>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {applications.map((application) => 
                    <ApplicationRow 
                        application={application} 
                        numSteeringCommittee={numSteeringCommittee} 
                    />)}
                </tbody>
            </Table>
        </InfiniteScroll >
    )
}

function ApplicationRow({application, numSteeringCommittee}: ApplicationRowProps) {
    const [statusCol, setStatusCol] = useState(<></>)
    useEffect(() => {
        setStatusCol(getStatusCol(application, numSteeringCommittee))
    }, [])

    const statusColor: Map<Application["status"], string> = new Map([
        ["Accepted", "green"],
        ["Rejected", "red"],
        ["Active", "blue"],
    ])

    const getStatusCol = ({status, stage, steeringCommitteeReview}: Application, numSC: number) => {
        let statusVO = status.toString()
        let stageVO  = <>stage.toString()</>
        let statusColorVO = statusColor.get(status)
    
    
        if (stage == "Draft") {
            statusVO = stage
            statusColorVO = "gray"
        } else if (stage == "PMReview" || stage == "BWGReview") {
            stageVO = <>In Review</>
        } else if (stage == "SCReview" && steeringCommitteeReview?.reviewStartDate) {
            const voteEndDate = new Date(steeringCommitteeReview.reviewStartDate)
            voteEndDate.setDate(voteEndDate.getDate() + 14);
            stageVO = <Countdown date={voteEndDate} />
            statusColorVO = "yellow"
            statusVO = "Voting • " + steeringCommitteeReview.totalReviewers + "/" + numSC
        }
    
        return (
            <>
                <Badge color={statusColorVO}>
                    {statusVO}
                </Badge>
                {status == "Active" && stage != "Draft" && <Text size={"xs"} color={"gray.6"}>{stageVO}</Text>}
            </>
        )
    }

    function getCategory(application: Application): [category: string, categoryColor: string] {
        if (application.biospecimenRequired && application.dataRequired) {
            return ["Biospec & Data", "violet"]
        } else {
            return ["Data Only", "orange"]
        }
    }

    return (
        <tr key={application.id + Math.random().toString()}>
            <td><TextTruncate line={2} text={application.title} /></td>
            <td style={{textAlign: "center"}}>
                <Badge color={getCategory(application)[1]} variant="outline">
                    {getCategory(application)[0]}
                </Badge>
            </td>
            <td>{application.institutionPrimary?.investigator}</td>
            <td><TextTruncate line={2} text={application.institutionPrimary?.institution} /></td>
            <td style={{textAlign: "center"}}>{new Date(application.createdAt).toLocaleString('en-GB').slice(0,9)}</td>
            <td style={{textAlign: "center"}}>{getStatusCol(application, numSteeringCommittee)}</td>
            <td>
                <Link href={"/applications/" + application.id} passHref>
                    <Button component='a' variant='subtle'>Details</Button>
                </Link>
            </td>
        </tr>
    )
}