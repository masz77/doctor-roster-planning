# Add Doctor Flow

This document outlines the flow for administrators to add a new doctor to the system.

## Process Flow

```mermaid
flowchart TD
    A[Admin navigates to Doctor Management] --> B[Clicks 'Add New Doctor' button]
    B --> C[Form displayed with required fields]
    C --> D[Admin fills form]
    D --> |Required Fields| E[Email]
    D --> |Required Fields| F[Full Name]
    D --> |Optional Fields| G[Additional Email]
    D --> |Required Fields| H[Weekly Hours]
    E & F & G & H --> I[Admin submits form]
    I --> J[Frontend validation]
    J --> |Valid| K[API request to create doctor]
    J --> |Invalid| C
    K --> L[Backend validates input]
    L --> |Valid| M[Generate random password]
    L --> |Invalid| N[Return validation error]
    N --> C
    M --> O[Create doctor record in database]
    O --> P[Return success with generated password]
    P --> Q[Frontend displays success message with password]
    Q --> R[Admin can copy password to share with doctor]
    R --> S[Doctor receives credentials]
    S --> T[Doctor logs in and changes password]
```

## Field Details

- **Email**: Primary email address for the doctor (required)
- **Full Name**: Doctor's complete name (required)
- **Additional Email**: Secondary email address (optional)
- **Weekly Hours**: Number of hours the doctor works per week (required)

## Password Handling

1. System generates a secure random password
2. Password is returned to the frontend only once during creation
3. Admin must securely share the password with the doctor
4. Doctor will be prompted to change password on first login

## Security Considerations

- Password is only displayed once at creation time
- No option to retrieve the original password later
- System should enforce secure password requirements on change
- All communication should occur over encrypted connections 