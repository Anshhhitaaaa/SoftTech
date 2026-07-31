FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY . .
RUN dotnet restore "backend/SystemConfigApi/SystemConfigApi.csproj"
RUN dotnet publish "backend/SystemConfigApi/SystemConfigApi.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=1
ENV DOTNET_USE_POLLING_FILE_WATCHER=false

ENTRYPOINT ["dotnet", "SystemConfigApi.dll"]
