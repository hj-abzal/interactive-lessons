import React, {useEffect, useState} from 'react';
import {lessonsRouter, appRouter} from '@/app/routes';
import {Route, Switch} from 'react-router-dom';
import {Header} from '@/components/header';
import {IframeLessonViewer} from '@/app/pages/iframe-lesson-viewer';
import {ConstructorPage} from '@/app/pages/constructor-editor';
import EcoMixedForest from '@/lessons/eco-mixed-forest';
import EcoMixedForestTrainer from '@/lessons/eco-mixed-forest-trainer';
import bioWorldStrangerVision from '@/lessons/bio-world-stranger-vision';
import {AppWrapper} from '@/app/app-wrapper';
import {ConstructorViewPage} from '@/app/pages/constructor-viewer';

export const App = () => {
    const [isIframe, setIsIframe] = useState(true);

    useEffect(() => {
        setIsIframe(window.top !== window.self);
    }, []);

    return (
        <AppWrapper>
            {!isIframe &&
                        <Header />
            }
            <Switch>
                <Route
                    {...appRouter.routes.iframeView}
                    component={IframeLessonViewer}
                />

                <Route
                    {...appRouter.routes.iframeConstructorView}
                    component={IframeLessonViewer}
                />

                <Route
                    {...appRouter.routes.constructor}
                    component={ConstructorPage}
                />

                <Route
                    {...appRouter.routes.constructorView}
                    component={ConstructorViewPage}
                />

                {/*  Dev роуты для неконструкторных сценариев*/}

                <Route
                    {...lessonsRouter.routes['eco-mixed-forest']}
                    component={EcoMixedForest}
                />

                <Route
                    {...lessonsRouter.routes['eco-mixed-forest-trainer']}
                    component={EcoMixedForestTrainer}
                />

                <Route
                    {...lessonsRouter.routes['bio-world-stranger-vision']}
                    component={bioWorldStrangerVision}
                />
            </Switch>
        </AppWrapper>
    );
};
