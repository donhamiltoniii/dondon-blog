export function getTitleFromSlug(slug: string) {
    const slugArr = slug.split('/')

    return slugArr[slugArr.length - 1]
}