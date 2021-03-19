export default function CheckType(isIframe , isGuru)
{
    if(isIframe && isGuru)
    {
        return 'iframe'
    }

    else if(!isIframe && isGuru)
    {
        return 'modal'
    }

return 'external'
}


export function resolveType(choice)
{
    if(choice == 'modal'){
        return [false,true];
    }

    else if(choice == 'iframe')
    {
        return [true,true]
    }

    return [false,false]
}