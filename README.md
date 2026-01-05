# Blueprint

A comprehensive lifestyle design application built to help users achieve their full potential across multiple life dimensions including fitness, financial success, relationships, personal style, and fulfillment.

## Overview

Blueprint is a modern web application that provides personalized guidance and resources to help users systematically improve different aspects of their lives. The platform combines user-friendly design with robust security features to create a safe, engaging experience for personal development.

## Features

### Core Functionality
- **User Authentication System**: Secure registration and login powered by Firebase Authentication
- **Profile Management**: Comprehensive user profiles with password management capabilities
- **Topic-Based Navigation**: Organized access to eight key life improvement areas
- **Responsive Design**: Fully functional across desktop, tablet, and mobile devices
- **Real-Time Validation**: Client-side input validation with immediate user feedback

### Security Implementation
- **Input Validation**: Schema-based validation for all user inputs following OWASP best practices
- **Rate Limiting**: Protection against brute force attacks with configurable attempt limits
- **Data Sanitization**: XSS prevention through comprehensive input sanitization
- **Secure Authentication**: Firebase-backed authentication with encrypted password storage
- **Environment Variable Protection**: Sensitive API keys stored securely outside version control

### Life Improvement Topics
1. Fitness and Health
2. Financial Success
3. Social Mastery
4. Relationships
5. Style and Appearance
6. Purpose and Fulfillment
7. Mindset and Psychology
8. Skills and Learning

## Technology Stack

### Frontend
- **React 18**: Modern component-based UI framework
- **React Router**: Client-side routing and navigation
- **Vite**: Fast build tool and development server
- **CSS3**: Custom styling with CSS variables for theming

### Backend Services
- **Firebase Authentication**: Secure user authentication and session management
- **Cloud Firestore**: NoSQL database for user data and application state
- **Firebase Security Rules**: Server-side data access control

### Development Tools
- **npm**: Package management
- **ESLint**: Code quality and consistency
- **Git**: Version control

## Project Structure

```
blueprint-app/
├── src/
│   ├── config/           # Firebase and application configuration
│   ├── hooks/            # Custom React hooks (authentication context)
│   ├── pages/            # Page components (Login, Register, Home, etc.)
│   ├── styles/           # CSS modules and global styles
│   ├── utils/            # Utility functions (validation, rate limiting)
│   ├── App.jsx           # Root application component with routing
│   └── main.jsx          # Application entry point
├── public/               # Static assets
├── .env.example          # Environment variable template
└── package.json          # Project dependencies and scripts
```
### Code Organization
The codebase follows React best practices with a clear separation of concerns:
- **Pages**: Top-level route components
- **Hooks**: Reusable stateful logic (authentication, data fetching)
- **Utils**: Pure functions for validation, formatting, and business logic
- **Styles**: Component-specific and global styling

## Security Features

### Input Validation
All user inputs are validated using a comprehensive validation system:
- Username: Letters and underscores only, 3-20 characters
- Password: 8-20 characters with letters, numbers, or special characters
- Email: RFC 5322 compliant validation
- Names: Letters only, 2-20 characters

### Rate Limiting
Protection against abuse through client-side rate limiting:
- Login attempts: 5 per 15 minutes
- Registration attempts: 3 per hour
- Password reset requests: 3 per hour

### Data Protection
- Environment variables for sensitive configuration
- XSS prevention through input sanitization
- CSRF protection through Firebase security
- Secure password storage with Firebase Authentication

## Browser Compatibility

The application is tested and fully functional on:
- Chrome/Edge (latest versions)
- Firefox (latest versions)
- Safari (latest versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

The application architecture supports planned features including:
- Subscription and payment processing
- Course content management system
- Progress tracking and analytics
- Social features and community interaction
- Mobile applications (iOS and Android)
- Advanced personalization and AI-driven recommendations

## Contributing

This is a personal project and is not currently accepting contributions. However, feedback and suggestions are welcome through the Issues tab.

## License

This project is private and proprietary. All rights reserved.

## Contact

For questions or inquiries, please reach out through GitHub or LinkedIn.

## Acknowledgments

Built with modern web technologies and best practices in security, user experience, and application architecture. Special attention was given to creating a professional, production-ready codebase suitable for portfolio demonstration.


