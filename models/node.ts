export type Node = {
    id?: number | string,
    title: string,
    edges: { id: number | string, title: string }[]
}
