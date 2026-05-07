export function generateGuid(): string {
    function uUidMaker(): string {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return uUidMaker() + '-' + uUidMaker() + uUidMaker() + '-' + uUidMaker() + uUidMaker() + uUidMaker() + '-' + uUidMaker() + uUidMaker() + uUidMaker() + uUidMaker();
}
