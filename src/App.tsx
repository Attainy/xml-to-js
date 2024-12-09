import { useState, useEffect } from 'react';
import { xml2json } from 'xml-js';

function App() {
  const [items, setItems] = useState<any>(null);

  const sanitizeXml = (xml: string) => {
    return xml
      .trim() // 공백 제거
      .replace(/&(?!(amp;|lt;|gt;|quot;|apos;))/g, '&amp;') // 잘못된 '&' 처리
      .replace(/\s+/g, ' '); // 여러 공백과 줄바꿈을 단일 공백으로 변환
  };

  const fetchXmlData = async () => {
    try {
      const response = await fetch('/test.xml');
      const textData = await response.text();

      // XML 클렌징
      const sanitizedXml = sanitizeXml(textData);

      // XML → JSON 변환
      const jsonData = JSON.parse(
        xml2json(sanitizedXml, { compact: true, spaces: 2 })
      );

      // 데이터 추출
      const extractedItems = jsonData['job-search']?.jobs?.job;
      setItems(extractedItems);
    } catch (error) {
      console.error('Error fetching or parsing XML:', error);
    }
  };

  useEffect(() => {
    fetchXmlData();
  }, []);

  return (
    <div>
      <h1>Job Listings</h1>
      {items ? <pre>{JSON.stringify(items, null, 2)}</pre> : <p>Loading...</p>}
    </div>
  );
}

export default App;
