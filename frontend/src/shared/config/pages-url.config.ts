class DASHBOARD {
    private root = ''

    HOME = `${this.root}/home`
    HISTORY = `${this.root}/history`
    ANALYTICS = `${this.root}/analytics`
    SETTINGS = `${this.root}/settings`
    SETTINGS_CATEGORIES = `${this.root}/settings/categories`
}

export const PAGES = {
    root: '/',
    LOGIN: '/login',
    SIGNUP: '/signup',
    DASHBOARD: new DASHBOARD(),
}