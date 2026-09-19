"""
RAG Knowledge Base Engine for Whitespace CRM Voice Agent.
Provides fast, sub-50ms semantic & keyword hybrid retrieval over medications,
company policies, FAQs, and customer support rules.
"""

import json
import math
import os
import re
from typing import Dict, List, Optional, Tuple


class KnowledgeBase:
    def __init__(self, data_path: Optional[str] = None):
        if data_path is None:
            base_dir = os.path.dirname(os.path.abspath(__file__))
            data_path = os.path.join(base_dir, "data", "default_knowledge.json")
        self.data_path = data_path
        self.documents: List[Dict] = []
        self.vocab: Dict[str, int] = {}
        self.doc_vectors: List[Dict[str, float]] = []
        self.idf: Dict[str, float] = {}
        self.load_data()

    STOP_WORDS = {
        "a", "about", "an", "and", "are", "as", "at", "be", "by", "can", "could", "do",
        "does", "for", "from", "how", "i", "in", "is", "it", "me", "much", "my", "of",
        "on", "or", "our", "that", "the", "their", "then", "there", "these", "they", "this",
        "to", "was", "what", "when", "where", "which", "who", "will", "with", "would", "you", "your"
    }

    def _tokenize(self, text: str, remove_stopwords: bool = False) -> List[str]:
        """Tokenize text into lowercase alphanumeric words."""
        tokens = re.findall(r"\b[a-zA-Z0-9\-\']+\b", text.lower())
        if remove_stopwords:
            return [t for t in tokens if t not in self.STOP_WORDS]
        return tokens

    def load_data(self):
        """Loads knowledge documents and computes index."""
        if not os.path.exists(self.data_path):
            print(f"[RAG] Warning: Knowledge base data file not found at {self.data_path}")
            self.documents = []
            return

        with open(self.data_path, "r", encoding="utf-8") as f:
            self.documents = json.load(f)

        print(f"[RAG] Loaded {len(self.documents)} knowledge documents.")
        self._build_index()

    def _build_index(self):
        """Builds an in-memory TF-IDF vector index for fast, low-latency search."""
        doc_count = len(self.documents)
        if doc_count == 0:
            return

        # 1. Document term frequencies
        doc_term_freqs = []
        doc_freqs: Dict[str, int] = {}

        for doc in self.documents:
            # Combine title, category, content, and keywords for indexing
            text = f"{doc.get('title', '')} {doc.get('category', '')} {doc.get('content', '')} {' '.join(doc.get('keywords', []))}"
            tokens = self._tokenize(text, remove_stopwords=True)
            tf: Dict[str, int] = {}
            for t in tokens:
                tf[t] = tf.get(t, 0) + 1
            doc_term_freqs.append(tf)

            for t in set(tokens):
                doc_freqs[t] = doc_freqs.get(t, 0) + 1

        # 2. IDF calculation
        self.idf = {
            t: math.log((1 + doc_count) / (1 + df)) + 1.0
            for t, df in doc_freqs.items()
        }

        # 3. Normalized TF-IDF vectors
        self.doc_vectors = []
        for tf in doc_term_freqs:
            vec: Dict[str, float] = {}
            length_sq = 0.0
            for t, count in tf.items():
                val = (1.0 + math.log(count)) * self.idf.get(t, 1.0)
                vec[t] = val
                length_sq += val * val
            length = math.sqrt(length_sq) or 1.0
            for t in vec:
                vec[t] /= length
            self.doc_vectors.append(vec)

    def search(self, query: str, top_k: int = 2) -> List[Dict]:
        """
        Searches knowledge documents using cosine similarity with keyword boosting.
        Returns top_k most relevant documents.
        """
        if not self.documents or not query.strip():
            return []

        q_tokens = self._tokenize(query, remove_stopwords=True)
        if not q_tokens:
            q_tokens = self._tokenize(query, remove_stopwords=False)
        if not q_tokens:
            return []

        # Query vector
        q_tf: Dict[str, int] = {}
        for t in q_tokens:
            q_tf[t] = q_tf.get(t, 0) + 1

        q_vec: Dict[str, float] = {}
        length_sq = 0.0
        for t, count in q_tf.items():
            idf_val = self.idf.get(t, 1.0)
            val = (1.0 + math.log(count)) * idf_val
            q_vec[t] = val
            length_sq += val * val
        q_len = math.sqrt(length_sq) or 1.0
        for t in q_vec:
            q_vec[t] /= q_len

        scores: List[Tuple[float, int]] = []
        for idx, doc_vec in enumerate(self.doc_vectors):
            # Cosine similarity
            sim = sum(q_vec[t] * doc_vec[t] for t in q_vec if t in doc_vec)

            # Extra boost for exact match on title or keywords
            doc = self.documents[idx]
            keywords = [k.lower() for k in doc.get("keywords", [])]
            title_lower = doc.get("title", "").lower()

            for t in q_tokens:
                if t in keywords:
                    sim += 0.50
                if t in title_lower:
                    sim += 0.60

            if sim > 0.05:
                scores.append((sim, idx))

        scores.sort(key=lambda x: x[0], reverse=True)

        results = []
        for score, idx in scores[:top_k]:
            item = dict(self.documents[idx])
            item["score"] = round(score, 4)
            results.append(item)

        return results

    def format_for_speech(self, results: List[Dict]) -> str:
        """
        Formats retrieved knowledge into a concise, voice-friendly summary for the caller.
        """
        if not results:
            return "I couldn't find specific details for that in our knowledge base. Please check with our licensed pharmacist."

        snippets = []
        for doc in results:
            content = doc.get("content", "").strip()
            title = doc.get("title", "").strip()
            snippets.append(f"{title}: {content}")

        return " ".join(snippets)


# Global singleton instance
_kb_instance: Optional[KnowledgeBase] = None


def get_knowledge_base() -> KnowledgeBase:
    global _kb_instance
    if _kb_instance is None:
        _kb_instance = KnowledgeBase()
    return _kb_instance


def query_knowledge_base(query: str, top_k: int = 2) -> Dict:
    """Convenience function to query and format for voice agent response."""
    kb = get_knowledge_base()
    results = kb.search(query, top_k=top_k)
    speech_text = kb.format_for_speech(results)
    return {
        "query": query,
        "results_count": len(results),
        "results": results,
        "speech_summary": speech_text
    }


if __name__ == "__main__":
    kb = get_knowledge_base()
    test_queries = [
        "What are the side effects of aspirin?",
        "Do I need a prescription for tramadol?",
        "What are your delivery hours and shipping cost?",
        "How much is ibuprofen and can I use it for headache?"
    ]
    for q in test_queries:
        print(f"\nQ: {q}")
        res = query_knowledge_base(q)
        print(f"A ({res['results_count']} results): {res['speech_summary']}")
