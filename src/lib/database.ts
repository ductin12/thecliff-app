import { promises as fs } from 'fs';
import path from 'path';
import {
    AdminDatabase,
    AdminButton,
    AdminPhoneNumber,
    AdminSocialLink,
    AdminWebhook,
    HousekeepingSubmission,
    FoodOrderSubmission,
    SurveySubmission,
    AnalyticsEvent,
} from '@/types/admin';

// Path to the JSON database
const DATA_DIR = path.join(process.cwd(), 'data');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');

// Default database structure
const DEFAULT_DATABASE: AdminDatabase = {
    buttons: [],
    phoneNumbers: [],
    socialLinks: [],
    webhooks: [],
    formSubmissions: {
        housekeeping: [],
        orderfood: [],
        survey: [],
    },
    analytics: {
        pageViews: [],
        buttonClicks: [],
    },
    settings: {
        wifiSsid: 'Thecliff',
        wifiPassword: '123456',
        wifiSecurityType: 'WPA',
        defaultLocale: 'en',
        supportedLocales: ['en', 'vi', 'ru', 'fr', 'ko'],
    },
};

// Helper to generate unique ID
export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Helper to get current timestamp
export function getTimestamp(): string {
    return new Date().toISOString();
}

// Read the entire database
export async function readDatabase(): Promise<AdminDatabase> {
    try {
        const data = await fs.readFile(CONFIG_FILE, 'utf-8');
        return JSON.parse(data) as AdminDatabase;
    } catch (error) {
        // If file doesn't exist, create with defaults
        console.error('Error reading database, using defaults:', error);
        await writeDatabase(DEFAULT_DATABASE);
        return DEFAULT_DATABASE;
    }
}

// Write the entire database
export async function writeDatabase(data: AdminDatabase): Promise<void> {
    try {
        // Ensure data directory exists
        await fs.mkdir(DATA_DIR, { recursive: true });
        await fs.writeFile(CONFIG_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error writing database:', error);
        throw new Error('Failed to write database');
    }
}

// ==================== BUTTONS ====================

export async function getButtons(): Promise<AdminButton[]> {
    const db = await readDatabase();
    return db.buttons.filter(b => b.enabled).sort((a, b) => a.order - b.order);
}

export async function getAllButtons(): Promise<AdminButton[]> {
    const db = await readDatabase();
    return db.buttons.sort((a, b) => a.order - b.order);
}

export async function getButtonById(id: string): Promise<AdminButton | undefined> {
    const db = await readDatabase();
    return db.buttons.find(b => b.id === id);
}

export async function createButton(button: Omit<AdminButton, 'createdAt' | 'updatedAt'>): Promise<AdminButton> {
    const db = await readDatabase();
    const newButton: AdminButton = {
        ...button,
        createdAt: getTimestamp(),
        updatedAt: getTimestamp(),
    };
    db.buttons.push(newButton);
    await writeDatabase(db);
    return newButton;
}

export async function updateButton(id: string, updates: Partial<AdminButton>): Promise<AdminButton | null> {
    const db = await readDatabase();
    const index = db.buttons.findIndex(b => b.id === id);
    if (index === -1) return null;

    db.buttons[index] = {
        ...db.buttons[index],
        ...updates,
        id, // Prevent ID change
        updatedAt: getTimestamp(),
    };
    await writeDatabase(db);
    return db.buttons[index];
}

export async function deleteButton(id: string): Promise<boolean> {
    const db = await readDatabase();
    const index = db.buttons.findIndex(b => b.id === id);
    if (index === -1) return false;

    db.buttons.splice(index, 1);
    await writeDatabase(db);
    return true;
}

export async function reorderButtons(buttonIds: string[]): Promise<AdminButton[]> {
    const db = await readDatabase();
    buttonIds.forEach((id, index) => {
        const button = db.buttons.find(b => b.id === id);
        if (button) {
            button.order = index + 1;
            button.updatedAt = getTimestamp();
        }
    });
    await writeDatabase(db);
    return db.buttons.sort((a, b) => a.order - b.order);
}

// ==================== PHONE NUMBERS ====================

export async function getPhoneNumbers(): Promise<AdminPhoneNumber[]> {
    const db = await readDatabase();
    return db.phoneNumbers.filter(p => p.enabled).sort((a, b) => a.order - b.order);
}

export async function getAllPhoneNumbers(): Promise<AdminPhoneNumber[]> {
    const db = await readDatabase();
    return db.phoneNumbers.sort((a, b) => a.order - b.order);
}

export async function getPhoneNumberById(id: string): Promise<AdminPhoneNumber | undefined> {
    const db = await readDatabase();
    return db.phoneNumbers.find(p => p.id === id);
}

export async function createPhoneNumber(phone: Omit<AdminPhoneNumber, 'createdAt' | 'updatedAt'>): Promise<AdminPhoneNumber> {
    const db = await readDatabase();
    const newPhone: AdminPhoneNumber = {
        ...phone,
        createdAt: getTimestamp(),
        updatedAt: getTimestamp(),
    };
    db.phoneNumbers.push(newPhone);
    await writeDatabase(db);
    return newPhone;
}

export async function updatePhoneNumber(id: string, updates: Partial<AdminPhoneNumber>): Promise<AdminPhoneNumber | null> {
    const db = await readDatabase();
    const index = db.phoneNumbers.findIndex(p => p.id === id);
    if (index === -1) return null;

    db.phoneNumbers[index] = {
        ...db.phoneNumbers[index],
        ...updates,
        id,
        updatedAt: getTimestamp(),
    };
    await writeDatabase(db);
    return db.phoneNumbers[index];
}

export async function deletePhoneNumber(id: string): Promise<boolean> {
    const db = await readDatabase();
    const index = db.phoneNumbers.findIndex(p => p.id === id);
    if (index === -1) return false;

    db.phoneNumbers.splice(index, 1);
    await writeDatabase(db);
    return true;
}

// ==================== SOCIAL LINKS ====================

export async function getSocialLinks(): Promise<AdminSocialLink[]> {
    const db = await readDatabase();
    return db.socialLinks.filter(s => s.enabled).sort((a, b) => a.order - b.order);
}

export async function getAllSocialLinks(): Promise<AdminSocialLink[]> {
    const db = await readDatabase();
    return db.socialLinks.sort((a, b) => a.order - b.order);
}

export async function getSocialLinkById(id: string): Promise<AdminSocialLink | undefined> {
    const db = await readDatabase();
    return db.socialLinks.find(s => s.id === id);
}

export async function createSocialLink(social: Omit<AdminSocialLink, 'createdAt' | 'updatedAt'>): Promise<AdminSocialLink> {
    const db = await readDatabase();
    const newSocial: AdminSocialLink = {
        ...social,
        createdAt: getTimestamp(),
        updatedAt: getTimestamp(),
    };
    db.socialLinks.push(newSocial);
    await writeDatabase(db);
    return newSocial;
}

export async function updateSocialLink(id: string, updates: Partial<AdminSocialLink>): Promise<AdminSocialLink | null> {
    const db = await readDatabase();
    const index = db.socialLinks.findIndex(s => s.id === id);
    if (index === -1) return null;

    db.socialLinks[index] = {
        ...db.socialLinks[index],
        ...updates,
        id,
        updatedAt: getTimestamp(),
    };
    await writeDatabase(db);
    return db.socialLinks[index];
}

export async function deleteSocialLink(id: string): Promise<boolean> {
    const db = await readDatabase();
    const index = db.socialLinks.findIndex(s => s.id === id);
    if (index === -1) return false;

    db.socialLinks.splice(index, 1);
    await writeDatabase(db);
    return true;
}

// ==================== WEBHOOKS ====================

export async function getWebhooks(): Promise<AdminWebhook[]> {
    const db = await readDatabase();
    return db.webhooks;
}

export async function getWebhookById(id: string): Promise<AdminWebhook | undefined> {
    const db = await readDatabase();
    return db.webhooks.find(w => w.id === id);
}

export async function createWebhook(webhook: Omit<AdminWebhook, 'id' | 'createdAt' | 'updatedAt'>): Promise<AdminWebhook> {
    const db = await readDatabase();
    const newWebhook: AdminWebhook = {
        ...webhook,
        id: generateId(),
        createdAt: getTimestamp(),
        updatedAt: getTimestamp(),
    };
    db.webhooks.push(newWebhook);
    await writeDatabase(db);
    return newWebhook;
}

export async function updateWebhook(id: string, updates: Partial<AdminWebhook>): Promise<AdminWebhook | null> {
    const db = await readDatabase();
    const index = db.webhooks.findIndex(w => w.id === id);
    if (index === -1) return null;

    db.webhooks[index] = {
        ...db.webhooks[index],
        ...updates,
        id,
        updatedAt: getTimestamp(),
    };
    await writeDatabase(db);
    return db.webhooks[index];
}

export async function deleteWebhook(id: string): Promise<boolean> {
    const db = await readDatabase();
    const index = db.webhooks.findIndex(w => w.id === id);
    if (index === -1) return false;

    db.webhooks.splice(index, 1);
    await writeDatabase(db);
    return true;
}

// ==================== FORM SUBMISSIONS ====================

export async function addFormSubmission(
    type: 'housekeeping' | 'orderfood' | 'survey',
    submission: HousekeepingSubmission | FoodOrderSubmission | SurveySubmission
): Promise<void> {
    const db = await readDatabase();
    db.formSubmissions[type].push(submission as never);
    await writeDatabase(db);

    // Trigger webhooks
    await triggerWebhooks('form_submit', { type, submission });
}

export async function getFormSubmissions(
    type: 'housekeeping' | 'orderfood' | 'survey',
    options?: { page?: number; pageSize?: number; status?: string }
): Promise<{ data: (HousekeepingSubmission | FoodOrderSubmission | SurveySubmission)[]; total: number }> {
    const db = await readDatabase();

    // Create a typed copy of submissions for filtering/sorting
    let submissions: (HousekeepingSubmission | FoodOrderSubmission | SurveySubmission)[] =
        [...db.formSubmissions[type]] as (HousekeepingSubmission | FoodOrderSubmission | SurveySubmission)[];

    // Filter by status
    if (options?.status) {
        submissions = submissions.filter(s => s.status === options.status);
    }

    // Sort by newest first
    submissions = submissions.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const total = submissions.length;

    // Pagination
    if (options?.page && options.pageSize) {
        const start = (options.page - 1) * options.pageSize;
        submissions = submissions.slice(start, start + options.pageSize);
    }

    return { data: submissions, total };
}

export async function updateFormSubmissionStatus(
    type: 'housekeeping' | 'orderfood' | 'survey',
    id: string,
    status: 'pending' | 'processing' | 'completed' | 'cancelled'
): Promise<boolean> {
    const db = await readDatabase();
    const submissions = db.formSubmissions[type];
    const index = submissions.findIndex((s: { id: string }) => s.id === id);
    if (index === -1) return false;

    (submissions[index] as { status: string; processedAt?: string }).status = status;
    if (status === 'completed') {
        (submissions[index] as { processedAt: string }).processedAt = getTimestamp();
    }
    await writeDatabase(db);
    return true;
}

// ==================== ANALYTICS ====================

export async function trackEvent(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): Promise<void> {
    const db = await readDatabase();
    const newEvent: AnalyticsEvent = {
        ...event,
        id: generateId(),
        timestamp: getTimestamp(),
    };

    if (event.type === 'page_view') {
        db.analytics.pageViews.push(newEvent);
        // Keep only last 10000 events
        if (db.analytics.pageViews.length > 10000) {
            db.analytics.pageViews = db.analytics.pageViews.slice(-10000);
        }
    } else if (event.type === 'button_click') {
        db.analytics.buttonClicks.push(newEvent);
        if (db.analytics.buttonClicks.length > 10000) {
            db.analytics.buttonClicks = db.analytics.buttonClicks.slice(-10000);
        }
    }

    await writeDatabase(db);

    // Trigger webhooks for button clicks
    if (event.type === 'button_click') {
        await triggerWebhooks('button_click', event);
    }
}

export async function getAnalyticsSummary(days: number = 7): Promise<{
    totalPageViews: number;
    totalButtonClicks: number;
    buttonClicksByTarget: Record<string, number>;
    dailyStats: { date: string; pageViews: number; buttonClicks: number }[];
}> {
    const db = await readDatabase();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const recentPageViews = db.analytics.pageViews.filter(
        e => new Date(e.timestamp) >= cutoffDate
    );
    const recentButtonClicks = db.analytics.buttonClicks.filter(
        e => new Date(e.timestamp) >= cutoffDate
    );

    // Count by target
    const buttonClicksByTarget: Record<string, number> = {};
    recentButtonClicks.forEach(e => {
        const target = e.target || 'unknown';
        buttonClicksByTarget[target] = (buttonClicksByTarget[target] || 0) + 1;
    });

    // Daily stats
    const dailyStats: Record<string, { pageViews: number; buttonClicks: number }> = {};
    for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        dailyStats[dateStr] = { pageViews: 0, buttonClicks: 0 };
    }

    recentPageViews.forEach(e => {
        const dateStr = e.timestamp.split('T')[0];
        if (dailyStats[dateStr]) {
            dailyStats[dateStr].pageViews++;
        }
    });

    recentButtonClicks.forEach(e => {
        const dateStr = e.timestamp.split('T')[0];
        if (dailyStats[dateStr]) {
            dailyStats[dateStr].buttonClicks++;
        }
    });

    return {
        totalPageViews: recentPageViews.length,
        totalButtonClicks: recentButtonClicks.length,
        buttonClicksByTarget,
        dailyStats: Object.entries(dailyStats)
            .map(([date, stats]) => ({ date, ...stats }))
            .sort((a, b) => a.date.localeCompare(b.date)),
    };
}

// ==================== SETTINGS ====================

export async function getSettings(): Promise<AdminDatabase['settings']> {
    const db = await readDatabase();
    return db.settings;
}

export async function updateSettings(updates: Partial<AdminDatabase['settings']>): Promise<AdminDatabase['settings']> {
    const db = await readDatabase();
    db.settings = { ...db.settings, ...updates };
    await writeDatabase(db);
    return db.settings;
}

// ==================== WEBHOOKS TRIGGER ====================

async function triggerWebhooks(event: string, data: unknown): Promise<void> {
    const db = await readDatabase();
    const webhooksToTrigger = db.webhooks.filter(
        w => w.enabled && w.events.includes(event as never)
    );

    for (const webhook of webhooksToTrigger) {
        try {
            await fetch(webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...webhook.headers,
                },
                body: JSON.stringify({ event, data, timestamp: getTimestamp() }),
            });

            // Update last triggered
            webhook.lastTriggered = getTimestamp();
        } catch (error) {
            console.error(`Failed to trigger webhook ${webhook.id}:`, error);
        }
    }

    // Save updated webhooks
    await writeDatabase(db);
}

// ==================== EXPORT/IMPORT ====================

export async function exportConfig(): Promise<Omit<AdminDatabase, 'formSubmissions' | 'analytics'>> {
    const db = await readDatabase();
    return {
        buttons: db.buttons,
        phoneNumbers: db.phoneNumbers,
        socialLinks: db.socialLinks,
        webhooks: db.webhooks,
        settings: db.settings,
    };
}

export async function importConfig(config: Partial<AdminDatabase>): Promise<void> {
    const db = await readDatabase();
    if (config.buttons) db.buttons = config.buttons;
    if (config.phoneNumbers) db.phoneNumbers = config.phoneNumbers;
    if (config.socialLinks) db.socialLinks = config.socialLinks;
    if (config.webhooks) db.webhooks = config.webhooks;
    if (config.settings) db.settings = { ...db.settings, ...config.settings };
    await writeDatabase(db);
}
