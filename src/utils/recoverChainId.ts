const recoverChainId = () => {
    const preChainId = window.localStorage.getItem('prevChainId')
    if (preChainId !== null) {
        console.log('3333333333333333333333333')
        window.localStorage.setItem('chainId', preChainId)
    }
}

export default recoverChainId
