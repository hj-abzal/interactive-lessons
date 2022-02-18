import React from 'react';
import {Link} from 'react-router-dom';
import {css} from '@emotion/react';

type LinkType = {
    path: string,
    name: string,
}

export type Props = {
    links: LinkType[],
}

export const LessonNavigation = ({
    links,
}: Props) => {
    return (
        <div css={css`
            font-weight: bold;
            .nav-link {
              display: block;
              margin-top: 5px;
            }
        `}>
            <div className="nav-dropdown">
                {links.map((link) => (
                    <Link className='nav-link' key={link.name} to={link.path} >{link.name}</Link>
                ))}
            </div>
        </div>
    );
};
