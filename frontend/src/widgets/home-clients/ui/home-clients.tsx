import Image from "next/image";
import { companyClients, type CompanyClient } from "@/entities/company";
import { Container } from "@/shared/ui";

const half = Math.ceil(companyClients.length / 2);
const rows: readonly (readonly CompanyClient[])[] = [companyClients.slice(0, half), companyClients.slice(half)];

function ClientLogo({ client, hidden }: { client: CompanyClient; hidden?: boolean }) {
  return (
    <li className="clients-logo" aria-hidden={hidden || undefined}>
      <Image
        src={client.logo}
        alt={hidden ? "" : client.name}
        width={client.width}
        height={client.height}
        sizes="200px"
        className="h-full w-full object-contain"
      />
    </li>
  );
}

export function HomeClients() {
  return (
    <section id="clients" aria-labelledby="clients-title" className="home-clients py-16 sm:py-20 lg:py-24">
      <Container className="mx-auto max-w-[1440px]">
        <div className="mb-10 grid gap-4 sm:mb-12 sm:gap-5 lg:mb-14 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-16">
          <h2 id="clients-title" className="text-3xl leading-[1.12] font-semibold tracking-[-0.035em] text-primary sm:text-4xl lg:text-5xl">
            Наши клиенты и партнёры
          </h2>
          <p className="max-w-lg text-sm leading-relaxed text-muted sm:text-base">
            Работаем с государственными структурами, промышленными предприятиями и крупными компаниями.
          </p>
        </div>
      </Container>

      <div className="clients-marquee">
        {rows.map((row, index) => (
          <div key={index} className="clients-row" data-direction={index % 2 ? "reverse" : "forward"}>
            <ul className="clients-track">
              {row.map((client) => (
                <ClientLogo key={client.logo} client={client} />
              ))}
              {row.map((client) => (
                <ClientLogo key={`${client.logo}-copy`} client={client} hidden />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
