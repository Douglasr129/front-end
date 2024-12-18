export class LocalStorageUtils {

    public obterUsuario() {
        const user = localStorage.getItem('devio.user');
        if (user !== undefined)
            return JSON.parse(user!)
        return {};
    }


    public salvarDadosLocaisUsuario(response: any) {
        this.salvarTokenUsuario(response.accessToken);
        this.salvarUsuario(response.userToken);
    }

    public limparDadosLocaisUsuario() {
        localStorage.removeItem('devio.token');
        localStorage.removeItem('devio.user');
    }

    public obterTokenUsuario(): string {
        return localStorage.getItem('devio.token') || '';
    }

    public salvarTokenUsuario(token: string) {
        localStorage.setItem('devio.token', token);
    }

    public salvarUsuario(user: string) {
        localStorage.setItem('devio.user', JSON.stringify(user));
    }

}