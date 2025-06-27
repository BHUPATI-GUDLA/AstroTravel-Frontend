export interface GenericResponse<T> {
    message : string,
    code : string,
    body : T
}
