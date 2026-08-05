function formatMedicine(item, idx = 0) {
  const openfda = item.openfda || {};
  return {
    fdaId: item.id || `fda_${idx}`,
    name: openfda.generic_name?.[0] || openfda.brand_name?.[0] || 'FDA OTC Remedy',
    brandName: openfda.brand_name?.[0] || openfda.substance_name?.[0] || 'Generic FDA OTC',
    uses: item.purpose?.[0] || item.indications_and_usage?.[0] || 'Relief of mild healthcare symptoms.',
    dosage: item.dosage_and_administration?.[0]?.substring(0, 300) || 'Check packaging label for exact dosage details.',
    warnings: item.warnings?.[0]?.substring(0, 300) || item.do_not_use?.[0]?.substring(0, 300) || 'Consult a healthcare professional prior to use.',
    sideEffects: item.stop_use?.[0]?.substring(0, 200) || 'Mild digestive discomfort or drowsiness may occur.',
    ingredients: openfda.substance_name || [openfda.generic_name?.[0] || 'Active OTC ingredient'],
    manufacturer: openfda.manufacturer_name?.[0] || 'FDA Registered Manufacturer',
    isOTC: true
  };
}

module.exports = formatMedicine;
