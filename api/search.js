
export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {
        const query = String(req.query.q || "").trim();

        if (!query) {
            return res.status(400).json({
                error: "Please enter a search word."
            });
        }

        const bibleId = "de4e12af7f28f599-01";

        const url = new URL(
            `https://rest.api.bible/v1/bibles/${bibleId}/search`
        );

        url.searchParams.set("query", query);
        url.searchParams.set("limit", "20");
        url.searchParams.set("sort", "relevance");

        const response = await fetch(url, {
            headers: {
                "api-key": process.env.API_BIBLE_KEY
            }
        });

        const result = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                error: result.message || "Bible search failed."
            });
        }

        return res.status(200).json(result.data);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Unable to search the Bible."
        });
    }
}
