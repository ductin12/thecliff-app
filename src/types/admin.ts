// Admin Panel Types

// Supported action types for buttons
export type ButtonAction = 'link' | 'phone' | 'email' | 'modal' | 'zalo';

// Supported modal types
export type AdminModalType = 'wifi' | 'housekeeping' | 'orderfood' | 'survey' | 'social';

// Button position in the app
export type ButtonPosition = 'header' | 'body' | 'footer';

// Phone number types
export type PhoneType = 'hotline' | 'frontdesk' | 'housekeeping' | 'security' | 'emergency' | 'medical' | 'custom';

// Social platforms
export type SocialPlatform = 'facebook' | 'instagram' | 'youtube' | 'zalo' | 'tiktok' | 'twitter' | 'custom';

// Webhook event types
export type WebhookEvent = 'form_submit' | 'button_click' | 'page_view';

// Localized string (supports multi-language)
export interface LocalizedString {
    en: string;
    vi?: string;
    ru?: string;
    fr?: string;
    ko?: string;
    [key: string]: string | undefined;
}

// Button configuration
export interface AdminButton {
    id: string;
    name: LocalizedString;
    icon: string;
    action: ButtonAction;
    url?: string;
    phone?: string;
    email?: string;
    modalType?: AdminModalType;
    position: ButtonPosition;
    order: number;
    enabled: boolean;
    customStyle?: {
        backgroundColor?: string;
        textColor?: string;
        iconSize?: string;
    };
    createdAt?: string;
    updatedAt?: string;
}

// Phone number configuration
export interface AdminPhoneNumber {
    id: string;
    label: LocalizedString;
    number: string;
    type: PhoneType;
    displayInFooter: boolean;
    order: number;
    enabled: boolean;
    createdAt?: string;
    updatedAt?: string;
}

// Social link configuration
export interface AdminSocialLink {
    id: string;
    platform: SocialPlatform;
    url: string;
    customIcon?: string;
    displayInFooter: boolean;
    order: number;
    enabled: boolean;
    createdAt?: string;
    updatedAt?: string;
}

// Webhook configuration
export interface AdminWebhook {
    id: string;
    name: string;
    url: string;
    events: WebhookEvent[];
    headers?: Record<string, string>;
    enabled: boolean;
    retryPolicy?: {
        maxRetries: number;
        retryDelayMs: number;
    };
    lastTriggered?: string;
    createdAt?: string;
    updatedAt?: string;
}

// Form submission base
export interface FormSubmissionBase {
    id: string;
    roomNumber?: string;
    guestName?: string;
    notes?: string;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    createdAt: string;
    processedAt?: string;
}

// Housekeeping request
export interface HousekeepingSubmission extends FormSubmissionBase {
    type: 'housekeeping';
    requestType: 'cleaning' | 'towels' | 'amenities' | 'maintenance' | 'other';
    preferredTime?: string;
}

// Food order
export interface FoodOrderSubmission extends FormSubmissionBase {
    type: 'orderfood';
    items: Array<{
        name: string;
        quantity: number;
        specialInstructions?: string;
    }>;
    deliveryTime?: string;
}

// Survey/Review
export interface SurveySubmission extends FormSubmissionBase {
    type: 'survey';
    phone?: string;
    email?: string;
    checkIn?: string;
    checkOut?: string;
    rating: number;
    criteriaRatings?: {
        room?: number;
        staff?: number;
        food?: number;
        beach?: number;
        cleanliness?: number;
    };
    feedback?: string;
}

// Union type for all form submissions
export type FormSubmission = HousekeepingSubmission | FoodOrderSubmission | SurveySubmission;

// Analytics event
export interface AnalyticsEvent {
    id: string;
    type: 'page_view' | 'button_click' | 'form_submit';
    target?: string;
    metadata?: Record<string, string | number>;
    userAgent?: string;
    locale?: string;
    timestamp: string;
}

// App settings
export interface AppSettings {
    wifiSsid: string;
    wifiPassword: string;
    wifiSecurityType: 'WPA' | 'WPA2' | 'WEP' | 'nopass';
    defaultLocale: string;
    supportedLocales: string[];
}

// Complete database structure
export interface AdminDatabase {
    buttons: AdminButton[];
    phoneNumbers: AdminPhoneNumber[];
    socialLinks: AdminSocialLink[];
    webhooks: AdminWebhook[];
    formSubmissions: {
        housekeeping: HousekeepingSubmission[];
        orderfood: FoodOrderSubmission[];
        survey: SurveySubmission[];
    };
    analytics: {
        pageViews: AnalyticsEvent[];
        buttonClicks: AnalyticsEvent[];
    };
    settings: AppSettings;
}

// API Response types
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// Pagination
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// Admin session
export interface AdminSession {
    authenticated: boolean;
    expiresAt?: string;
}
