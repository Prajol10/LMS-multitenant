FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080

ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production
ENV DOTNET_GCConserveMemory=9
ENV DOTNET_GCHeapHardLimit=400000000
ENV DOTNET_ThreadPool_UnfairSemaphoreSpinLimit=0
ENV COMPlus_GCConserveMemory=9

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["SchoolWebsite.csproj", "."]
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /app/publish \
    --runtime linux-x64 \
    --self-contained false \
    /p:PublishSingleFile=false

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "SchoolWebsite.dll"]
