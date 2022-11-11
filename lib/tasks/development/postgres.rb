module Development
  module Postgres

    def create_postgres
      system('docker pull postgres:13')
      system("docker build -t tradelink/postgres #{Rails.root.join('docker', 'postgres')}")
      system('docker run --name tradelink-postgres -p 5433:5432 -e POSTGRES_USER=tradelink -e POSTGRES_PASSWORD=tradelink -d --restart=always tradelink/postgres')
    end

  end
end
