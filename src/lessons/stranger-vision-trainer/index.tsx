import React from 'react';
import {createLesson} from '@/components/lesson-container';
import {MemoryRouter, Route} from 'react-router-dom';
import {strangerVisionRouter} from '@/lessons/bio-world-stranger-vision/routes';
import {LessonDevtools} from '@/components/devtools/lesson-devtools';

const BioWorldStrangerVision = () => (
    <MemoryRouter
        initialEntries={[strangerVisionRouter.build('strangerVisionFirstTrain')]}
    >
        {strangerVisionRouter.idsArr.map((key) => (
            <Route key={key} {...strangerVisionRouter.routes[key]} />
        ))}
        <LessonDevtools
            navigation={{
                links: strangerVisionRouter
                    .idsArr.map((key) =>
                        ({name: key, path: strangerVisionRouter.build(key)})
                    ),
            }}
        />
    </MemoryRouter>
);

export default createLesson(BioWorldStrangerVision, 'bio-stranger-vision-trainer');
