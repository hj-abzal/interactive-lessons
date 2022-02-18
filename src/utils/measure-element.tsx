import ReactDOM from 'react-dom';

const containerStyle = {
    display: 'inline-block',
    position: 'absolute',
    visibility: 'hidden',
    zIndex: -1,
};

export const measureElement = (element) => {
    // Creates the hidden div appended to the document body
    const container = document.createElement('div');
    // @ts-ignore
    container.style = containerStyle;
    document.body.appendChild(container);

    // Renders the React element into the hidden div

    ReactDOM.render(element, container);

    // Gets the element size
    const height = container.clientHeight;
    const width = container.clientWidth;

    // Removes the element and its wrapper from the document
    ReactDOM.unmountComponentAtNode(container);
    container.parentNode?.removeChild(container);

    return {height, width};
};
