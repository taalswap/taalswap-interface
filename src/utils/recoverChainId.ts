const recoverChainId = () => {
    const preChainId = window.localStorage.getItem('prevChainId')
    if (preChainId !== null) {
        window.localStorage.setItem('chainId', preChainId)
    }
}

export default recoverChainId
