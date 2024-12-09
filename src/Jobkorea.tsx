import { useState, useEffect } from "react";
import { xml2js } from "xml-js";

function Jobkorea() {
  const [datas, setDatas] = useState<any>(null);

  const sanitizeXml = (xml: string) => {
    return xml
      .trim() // 공백 제거
      .replace(/&(?!(amp;|lt;|gt;|quot;|apos;))/g, '&amp;') // 잘못된 '&' 처리
      .replace(/\s+/g, ' '); // 여러 공백과 줄바꿈을 단일 공백으로 변환
  };

  useEffect(() => {
    fetch("/test.xml")
      .then((res) => res.text())
      .then((data) => {
        try {
          // XML 클렌징
          const sanitizedData = sanitizeXml(data);

          // XML → JSON 변환
          const jsonData = xml2js(sanitizedData, { compact: true });

          // 상태 업데이트
          setDatas(jsonData);
          console.log("Parsed JSON Data:", jsonData);
        } catch (error) {
          console.error("Error parsing XML:", error);
        }
      })
      .catch((error) => {
        console.error("Error fetching XML:", error);
      });
  }, []);

  return (
    <div>
      <h1>Job Listings</h1>
      {datas ? (
        <pre>{JSON.stringify(datas, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Jobkorea;
