import fs from "node:fs";
import fetchSpendings from "./spendings.js";

let polozkaMap = null;

function getPolozkaName(polozkaCode) {
    if (!polozkaMap) {
        polozkaMap = new Map();
        try {
            const raw = fs.readFileSync(new URL("./polozka.json", import.meta.url), "utf-8");
            const items = JSON.parse(raw);
            for (const item of items) {
                const code = item.id || item.id_4 || item.id_3;
                if (code) {
                    if (!polozkaMap.has(code) || (item.datum_platnosti_do && item.datum_platnosti_do.startsWith("9999"))) {
                        polozkaMap.set(code, item.text_popis || item.text_nazev || "");
                    }
                }
            }
        } catch (e) {
            console.error("Error reading polozka.json:", e);
        }
    }
    return polozkaMap.get(String(polozkaCode).trim()) || "";
}

function formatCurrency(val) {
    return new Intl.NumberFormat("cs-CZ", {
        style: "currency",
        currency: "CZK",
        maximumFractionDigits: 2,
    }).format(val);
}

export default async function () {
    const data = await fetchSpendings();
    const radek = data?.VydajeRozpoctove?.Radek || [];

    return radek
        .map((r) => {
            const paragraf = r.Paragraf ? String(r.Paragraf).trim() : "";
            const polozka = r.Polozka ? String(r.Polozka).trim() : "";
            const code = !paragraf || paragraf === "0000" ? polozka : `${paragraf}/${polozka}`;
            const name = getPolozkaName(polozka);
            const pz = parseFloat(r.RozpocetPoZmenach) || 0;
            const vys = parseFloat(r.Vysledek) || 0;
            const diff = Math.abs(pz - vys);
            return {
                code,
                name,
                rozpocetPoZmenach: pz,
                rozpocetPoZmenachFormatted: formatCurrency(pz),
                vysledek: vys,
                vysledekFormatted: formatCurrency(vys),
                diff: diff,
                diffFormatted: formatCurrency(diff),
            };
        })
        .sort((a, b) => b.diff - a.diff)
        .slice(0, 10);
}
