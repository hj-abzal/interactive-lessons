export const ID = function () {
    return '_' + (Math.random() + Math.random() + Math.random()).toString(36).substr(2, 15);
};

export const GUID = () => { // 000004a1-69ba-47de-a243-ad97aadbfd58'
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0; const
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};
