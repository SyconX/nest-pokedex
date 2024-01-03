
export interface HttpAdapter {
    get<T>(url: string): Promise<T>;
    // post(url: string, data: any);
    // patch(url: string, data: any);
    // delete(url: string);
}