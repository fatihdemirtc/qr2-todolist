# QR Code Product Management System

A modern web application built with ASP.NET Core that allows users to manage products using QR codes. The system provides features for product management, user authentication, feedback collection, and administrative controls.

## Features

- **User Authentication**
  - User registration and login
  - External login support
  - Role-based authorization
  - User profile management

- **Product Management**
  - Create, read, update, and delete products
  - QR code generation for products
  - Product type categorization
  - Platform-specific product details

- **Scanning System**
  - QR code scanning functionality
  - Support for different device types
  - Scan history tracking

- **Feedback System**
  - User feedback collection
  - Feedback management for administrators
  - Detailed feedback analysis

- **Administrative Features**
  - User management
  - Product oversight
  - Feedback monitoring
  - System settings configuration

- **Error Handling**
  - Comprehensive error logging
  - Custom error pages
  - Exception middleware for consistent error handling

## Technical Stack

- **Framework**: ASP.NET Core (.NET 9)
- **Database**: Entity Framework Core with migrations
- **Authentication**: ASP.NET Core Identity
- **Architecture**: Razor Pages with MVC patterns
- **UI**: Bootstrap (via built-in layouts)

## Getting Started

### Prerequisites

- .NET 9 SDK
- SQL Server (or your preferred database provider)
- Visual Studio 2022 or later (recommended)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/fatihdemirtc/qr2-todolist.git
   ```

2. Navigate to the project directory:
   ```bash
   cd qr2-todolist
   ```

3. Restore dependencies:
   ```bash
   dotnet restore
   ```

4. Update the database:
   ```bash
   dotnet ef database update
   ```

5. Run the application:
   ```bash
   dotnet run
   ```

## Project Structure

- **/Areas/Identity**: Authentication and user management
- **/Controllers**: Application controllers for different features
- **/Models**: Data models and entities
- **/ViewModel**: View-specific models
- **/Views**: Razor views and pages
- **/Enum**: Enumeration types
- **/Services**: Application services
- **/Middlewares**: Custom middleware components
- **/Data**: Database context and configurations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team.