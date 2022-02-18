import React from 'react';
import Icon from '@/components/icon';
import {Controller} from 'react-hook-form';
import {WidgetProps} from './index';
import {OnCollapsedStyles, StyledButton, StyledWrapper} from './common-styles';
import classNames from 'classnames';
import {useConstructorScenario} from '@/context-providers/constructor-scenario';
import {TabsEnum} from '../../types';

const DataSceneEditor: React.FC<any> = ({params, control}:WidgetProps) => {
    const {produceState} = useConstructorScenario();
    return (
        <Controller
            render={({field}) => {
                return (<label>
                    <StyledWrapper className={classNames({
                        disabled: params.isDisabled,
                        hidden: params.isHidden,
                        'no-icon': true,
                    })}
                    css={!field.value && OnCollapsedStyles}>
                        <Icon size={16} glyph={params.icon} />
                        {params.label}
                        <StyledButton onClick={() => produceState((draft) => {
                            draft.constructor.currentTab = TabsEnum.scenes;
                        })}>Редактировать сцены</StyledButton>
                    </StyledWrapper>
                </label>);
            }}
            name={params.name}
            control={control}
            defaultValue={params.value}
        />
    );
};
export default DataSceneEditor;
