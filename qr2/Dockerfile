# ASP.NET Core çalýþma zamaný (runtime) katmaný
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# SDK (build-time) katmaný
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# 1. Sadece proje dosyasýný kopyala ve restore yap (cache dostu)
COPY ["qr2.csproj", "./"]
RUN dotnet restore "./qr2.csproj"

# 2. Tüm proje dosyalarýný kopyala
COPY . .

# 3. Build
RUN dotnet build "./qr2.csproj" -c $BUILD_CONFIGURATION -o /app/build

# 4. Publish
RUN dotnet publish "./qr2.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Final imaj - sadece çalýþacak dosyalar
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "qr2.dll"]
