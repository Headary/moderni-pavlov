import Fetch from "@11ty/eleventy-fetch";
import { XMLParser } from "fast-xml-parser";

// API docs: https://monitor.statnipokladna.gov.cz/datovy-katalog/webova-sluzba
const WEBSERVICE_URL = "https://monitor.statnipokladna.gov.cz/api/monitorws";
const CITY_ICO = "00283479";

async function fetchBudgetData(
    /** @type string */
    ico,
    /** @type number */
    rok,
    /**
     * Číslo výkazu
     * @type string
     */
    vykaz = "051",
    /**
     * Řád čísla, hodnoty 1, 1000, 1000000
     * @type number
     */
    rad = 1,
) {
    const icoFormatted = ico.padStart(8, "0");
    const vykazFormatted = vykaz.padStart(3, "0");

    const soapRequestXml = `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Header/>
    <soap:Body>
        <req:MonitorRequest
            xmlns:req="urn:cz:mfcr:monitor:schemas:MonitorRequest:v1"
            xmlns:mon="urn:cz:mfcr:monitor:schemas:MonitorTypes:v1">
            <req:Hlavicka>
                <mon:OrganizaceIC>${icoFormatted}</mon:OrganizaceIC>
                <mon:Rok>${rok}</mon:Rok>
                <mon:Vykaz>${vykazFormatted}</mon:Vykaz>
                <mon:Rad>${rad}</mon:Rad>
            </req:Hlavicka>
        </req:MonitorRequest>
    </soap:Body>
</soap:Envelope>`;

    const rawData = await Fetch(WEBSERVICE_URL, {
        duration: "90d",
        type: "xml",
        fetchOptions: {
            method: "POST",
            headers: {
                "Content-Type": "text/xml; charset=utf-8",
                SOAPAction: "",
            },
            body: soapRequestXml,
        },
    });

    return rawData;
}

async function parseXmlData(
    /** @type string */
    xmlString,
) {
    const parser = new XMLParser({
        ignoreAttributes: false,
        removeNSPrefix: true,
        parseTagValue: false,
    });

    const parsed = parser.parse(xmlString);

    return parsed?.Envelope?.Body?.MonitorResponse?.VykazData?.Fin212M;
}

export default async function () {
    const rawXml = await fetchBudgetData(CITY_ICO, 2025);
    const parsedData = await parseXmlData(rawXml);

    return parsedData;
}

