<!-- 854b9106-a7b8-4c78-962f-0726409b3377 3740fdbb-c8b0-4719-b132-96903ce148ba -->
# Comprehensive Fix: Name Consistency, Compliance Score, Styling & All Issues

## Critical User Experience Fixes

### 1. Fix User Name Consistency Throughout Application

**Priority: HIGH**

**Files to Update:**

- `app/clients/page.tsx` - Remove hardcoded "John Smith", use `useAuth()`
- `app/clients/new/page.tsx` - Remove hardcoded "John Smith", use `useAuth()`
- `app/clients/[id]/page.tsx` - Remove hardcoded "John Smith", use `useAuth()`
- `app/adverse-media/page.tsx` - Remove hardcoded "John Smith", use `useAuth()`
- `app/vendors/page.tsx` - Remove hardcoded "John Smith", use `useAuth()`
- `app/settings/page.tsx` - Use `useAuth()` instead of loading user separately
- `components/layout/unified-nav.tsx` - Get userName from `useAuth()` hook if not provided
- `components/layout/dashboard-shell.tsx` - Get userName from `useAuth()` if not provided

**Implementation:**

- Import and use `useAuth()` hook in all pages
- Pass `user?.name || undefined` to DashboardShell (never pass hardcoded names or "User")
- Update UnifiedNav to call `useAuth()` internally if userName prop is not provided
- Remove all hardcoded "John Smith" strings
- Only show fallback "User" if user is actually not logged in (loading state)
- Ensure name updates everywhere when user updates their profile

### 2. Implement Automatic Compliance Score Calculation

**Priority: HIGH**

**Files to Update:**

- `app/compliance/page.tsx` - Replace hardcoded '94%' with calculated score
- `lib/services/mock-data-service.ts` - Add `calculateComplianceScore()` method

**Implementation:**

- Create compliance score calculation function that considers:
- Document approval rate: (approved / total documents) * 40%
- Risk score average: (100 - average risk score) * 30%
- Onboarding completion: (completed / total clients) * 20%
- Timely document reviews: (reviewed on time / total) * 10%
- Score = weighted sum of all factors (0-100 scale)
- Update score automatically when:
- Documents are approved/rejected
- Risk scores change
- New clients are onboarded
- Documents are reviewed
- Display as percentage with trend indicator
- Calculate on-demand (not cached) to ensure real-time accuracy
- Show comparison to previous period or target

### 3. Fix Schedule Meeting Page

**Priority: HIGH**

**Files to Update:**

- `app/leads/schedule-meeting/page.tsx` - Wrap in DashboardShell, add meeting storage
- `lib/services/mock-data-service.ts` - Add meeting methods
- `lib/types/lead.ts` - Add Meeting interface

**Implementation:**

- Wrap page in `DashboardShell` component
- Create Meeting interface with: id, leadId, title, type, date, time, duration, attendees, notes, createdBy
- Add to mockDataService: `createMeeting()`, `getMeetingsByLeadId()`, `getMeetings()`
- Store meetings in localStorage with key 'stamped_meetings'
- Save meeting when form is submitted
- Add meeting as activity to lead
- Use `useAuth()` to get current user name
- Navigate back to leads page after successful submission

### 4. Ensure Consistent Font Styling Across All Dashboards

**Priority: HIGH**

**Files to Update:**

- `app/globals.css` - Change default font to Inter (sans-serif)
- `app/dashboard/page.tsx` - Ensure all text uses font-sans
- `app/client-portal/dashboard/page.tsx` - Ensure all text uses font-sans
- `app/vendor-portal/dashboard/page.tsx` - Ensure all text uses font-sans
- `app/compliance/page.tsx` - Ensure all text uses font-sans
- `app/executive/dashboard/page.tsx` - Ensure all text uses font-sans
- All dashboard components - Standardize font usage

**Implementation:**

- Update globals.css: Remove `font-serif` from h1-h6, use `font-sans` as default
- Standardize all headings: `font-sans text-3xl/4xl font-bold text-neutral-900`
- Standardize body text: `font-sans text-base text-neutral-600`
- Standardize labels: `font-sans text-sm font-medium text-neutral-700`
- Remove all `font-serif` classes, replace with `font-sans`
- Ensure Inter font is loaded (already in globals.css)
- Check every dashboard page for consistent font usage

### 5. Make Header Translucent Like Landing Page

**Priority: MEDIUM**

**Files to Update:**

- `components/layout/unified-nav.tsx` - Update background opacity

**Implementation:**

- Change `bg-white/70` to `bg-white/80 backdrop-blur-xl` to match landing page
- Update user menu background to `bg-white/80 backdrop-blur-sm`
- Ensure border remains `border-neutral-200/50`
- Match exact translucency level of landing page header

## Previously Identified Issues (From Original Plan)

### 6. Fix Risk Assessment Navigation

- **File**: `app/compliance/risk-assessment/page.tsx`
- Change `handleViewDetails` to navigate using `useRouter().push('/risk-analyst/analysis/${score.entityId}')`
- Remove alert, add proper navigation

### 7. Fix Random Notifications

- **File**: `lib/services/notification-service.ts`
- Remove `startSimulation()` method
- Remove any calls to `startSimulation()`
- Notifications should only come from real events

### 8. Add Profile/Settings Click Handler

- **File**: `components/layout/unified-nav.tsx`
- Make user menu clickable, navigate to `/settings` when clicked
- Add cursor-pointer and hover effects

### 9. Fix Leads Detail Page Error

- **File**: `app/leads/[id]/page.tsx`
- Use `mockDataService.getLeadById()` instead of direct mockLeads
- Fix async params handling
- Add proper error handling

### 10. Improve Pipeline Styling

- **File**: `components/leads/pipeline-board.tsx`
- Simplify card design
- Reduce visual noise
- Match dashboard card styling
- Use consistent fonts (font-sans)
- Clean up spacing and typography

### 11. Fix Messages Page

- **Files**: `app/client-portal/messages/page.tsx`
- Verify routing works
- Test message sending/receiving
- Add error handling

### 12. Fix Document Upload Error

- **Files**: `components/client-portal/document-upload-card.tsx`, `app/client-portal/documents/page.tsx`
- Verify `onUpload` prop signature: `(file: File) => Promise<void>`
- Ensure function is passed correctly

### 13. Add Employee Profile/Settings Access

- **File**: `components/layout/unified-nav.tsx`
- Ensure user menu click navigates to `/settings`
- Or add Settings link to employee navigation

### 14. Improve DeepSeek API for Accurate Next Steps

- **File**: `app/api/adverse-media/route.ts`
- Enhance system prompt with structured compliance recommendations
- Add specific next steps based on risk levels
- Format recommendations as structured data

## Implementation Order

1. **Phase 1 - Critical UX (Name & Compliance Score)**

- Fix user name consistency (all pages)
- Implement compliance score calculation
- Fix schedule meeting page

2. **Phase 2 - Styling Consistency**

- Standardize fonts across all dashboards
- Make header translucent
- Fix pipeline styling

3. **Phase 3 - Functionality Fixes**

- Fix risk assessment navigation
- Fix random notifications
- Fix leads detail page
- Fix document upload
- Fix messages page

4. **Phase 4 - Enhancements**

- Add profile/settings click handler
- Improve DeepSeek prompts
- Add employee profile access

## Testing Checklist

- [ ] User name appears correctly everywhere (no hardcoded names)
- [ ] Compliance score calculates automatically and updates
- [ ] Schedule meeting page works and saves meetings
- [ ] All dashboards use font-sans consistently
- [ ] Header is translucent like landing page
- [ ] Pipeline looks clean and matches UI
- [ ] Risk assessment navigates correctly
- [ ] No random notifications
- [ ] Leads detail page works
- [ ] Document upload works
- [ ] Messages page works
- [ ] Profile/settings accessible from user menu
- [ ] DeepSeek provides accurate recommendations

### To-dos

- [ ] Fix lead creation to persist new leads - update lead-form.tsx to call mockDataService.createLead() and store in localStorage/state