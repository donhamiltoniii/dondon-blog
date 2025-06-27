export function kebabToTitle(kebabString: string) {
    return kebabString
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}