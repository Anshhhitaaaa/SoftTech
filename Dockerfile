# .NET 8 Web API Dockerfile for Render Deployment
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy all files
COPY . .

# Restore and Publish .NET Web API project
RUN dotnet restore "backend/SystemConfigApi/SystemConfigApi.csproj"
RUN dotnet publish "backend/SystemConfigApi/SystemConfigApi.csproj" -c Release -o /app/publish

# Runtime Image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Environment variables for Linux container stability
ENV ASPNETCORE_URLS=http://+:8080
ENV DOTNET_USE_POLLING_FILE_WATCHER=false
EXPOSE 8080

ENTRYPOINT ["dotnet", "SystemConfigApi.dll"]
