export const trainerTemplate = ({guid, name}) => {
    return {
        __moduleGuid: guid, // '000004a1-69ba-47de-a243-ad97aadbfd58'
        task:
            {
                taskContentType: 'GAME',
                taskVersion: '1',
                guid: guid,
                laboriousness: 30,
                sourceSystem: 'XReady lab.',
                taskAssignmentType: 'INDIVIDUAL',
                taskCheckType: 'AUTO_CHECK',
                unlimitedAttempts: false,
                stageId: 6,
                subjectId: 10,
                taskType: 'CHECK',
                attemptsNumber: 3,
                title: `${name} (Тренажер)`,
                content: {
                    pages: [
                        {
                            pageNumber: 1,
                            sections: [
                                {
                                    sectionType: 'COL_WIDE',
                                    sectionOrder: 1,
                                    widgets:
                                        [
                                            {
                                                contentWidgetType: 'IFRAME',
                                                widgetGroupType: 'INFO',
                                                widgetNumber: 1,
                                                body: {
                                                    content: '',
                                                    src: '',
                                                    title: '',
                                                    description: '',
                                                    width: '',
                                                    height: '',
                                                },
                                            }
                                        ],
                                }
                            ],
                        }
                    ],
                },
            },
    };
};
