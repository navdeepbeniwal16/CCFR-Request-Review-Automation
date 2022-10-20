import { Stepper } from '@mantine/core';
import { IconCircleX } from '@tabler/icons';
import { Application } from '../lib/interfaces';
import { ApplicationStage, ApplicationStatus } from '../lib/utilities/AppEnums';

type ApplicationStepperProps = {
    application: Application;
};

export default function ApplicationStepper({
    application,
}: ApplicationStepperProps) {
    const stepperSteps = [
        'Submission',
        'PM Review',
        ...(application.biospecimenRequired ? ['BWG Chair Review'] : []),
        'Committee Vote',
        application.status == ApplicationStatus.Accepted
            ? 'Accepted'
            : application.status == ApplicationStatus.Rejected
            ? 'Rejected'
            : 'Result',
    ];

    const stages = Object.keys(ApplicationStage).filter(
        stage =>
            stage != ApplicationStage.BWGReview ||
            application.biospecimenRequired,
    );
    let appStageNumber = stages.indexOf(application.stage) - 1;
    if (appStageNumber == stages.length - 2) appStageNumber += 1;

    return (
        <Stepper size="sm" active={appStageNumber}>
            {stepperSteps.map((step, i) => (
                <Stepper.Step
                    key={i}
                    label={'Stage ' + (i + 1)}
                    description={step}
                    color={
                        i == stepperSteps.length - 1 &&
                        application.status == ApplicationStatus.Rejected
                            ? 'red'
                            : ''
                    }
                    completedIcon={
                        i == stepperSteps.length - 1 &&
                        application.status == ApplicationStatus.Rejected ? (
                            <IconCircleX />
                        ) : (
                            ''
                        )
                    }
                />
            ))}
        </Stepper>
    );
}
