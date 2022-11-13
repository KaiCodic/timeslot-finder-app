# frozen_string_literal: true

module Development
  module Docker
    def docker(command)
      `docker #{command}`.strip
    end

    def docker_container_running?(name)
      docker("ps|grep lcm-#{name}|wc -l").to_i.positive?
    end

    def docker_container_exists?(name)
      docker("ps -a|grep lcm-#{name}|wc -l").to_i.positive?
    end

    def destroy_docker_container(name)
      docker("stop lcm-#{name}") if docker_container_running?(name)
      docker("rm lcm-#{name}") if docker_container_exists?(name)
    end
  end
end
