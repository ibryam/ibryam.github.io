// DCF Calculator Logic
$(document).ready(function() {
    $('#dcf-form').on('submit', function(event) {
        event.preventDefault();
        
        // Get inputs
        const currentFCF = parseFloat($('#current-fcf').val());
        const growthRate1to5 = parseFloat($('#growth-rate-1-5').val()) / 100;
        const growthRate6to10 = parseFloat($('#growth-rate-6-10').val()) / 100;
        const discountRate = parseFloat($('#discount-rate').val()) / 100;
        const terminalGrowthRate = parseFloat($('#terminal-growth-rate').val()) / 100;
        const sharesOutstanding = parseFloat($('#shares-outstanding').val());
        const stockPrice = parseFloat($('#stock-price').val());
        
        // Input validation
        if (isNaN(currentFCF) || isNaN(growthRate1to5) || isNaN(growthRate6to10) ||
            isNaN(discountRate) || isNaN(terminalGrowthRate) || isNaN(sharesOutstanding) ||
            isNaN(stockPrice)) {
            alert('Please fill all fields with valid numbers.');
            return;
        }
        if (discountRate <= terminalGrowthRate) {
            alert('Discount Rate must be greater than Terminal Growth Rate.');
            return;
        }
        if (currentFCF <= 0 || sharesOutstanding <= 0 || discountRate <= 0) {
            alert('FCF, Shares Outstanding, and Discount Rate must be positive.');
            return;
        }
        if (stockPrice < 0) {
            alert('Stock Price cannot be negative.');
            return;
        }
        
        // Calculate FCF for Years 1–10
        let fcf = [currentFCF];
        for (let year = 1; year <= 5; year++) {
            fcf[year] = fcf[year-1] * (1 + growthRate1to5);
        }
        for (let year = 6; year <= 10; year++) {
            fcf[year] = fcf[year-1] * (1 + growthRate6to10);
        }
        
        // Calculate PV of FCF
        let pvFCF = [];
        for (let year = 1; year <= 10; year++) {
            const discountFactor = 1 / Math.pow(1 + discountRate, year);
            pvFCF[year] = fcf[year] * discountFactor;
        }
        
        // Sum Total PV of FCF
        const totalPVFCF = pvFCF.reduce((sum, val) => sum + val, 0);
        
        // Calculate Terminal Value
        const year10FCF = fcf[10];
        const year11FCF = year10FCF * (1 + terminalGrowthRate);
        const terminalValue = year11FCF / (discountRate - terminalGrowthRate);
        
        // Calculate PV of Terminal Value
        const discountFactor10 = 1 / Math.pow(1 + discountRate, 10);
        const pvTerminalValue = terminalValue * discountFactor10;
        
        // Calculate Enterprise Value
        const enterpriseValue = totalPVFCF + pvTerminalValue;
        
        // Calculate Intrinsic Value per Share
        const intrinsicValue = enterpriseValue / sharesOutstanding;
        
        // Calculate Margin of Safety
        const marginSafety = ((intrinsicValue - stockPrice) / intrinsicValue) * 100;
        
        // Display results
        $('#year10-fcf').text(year10FCF.toFixed(2));
        $('#year10-pv-fcf').text(pvFCF[10].toFixed(2));
        $('#terminal-value').text(terminalValue.toFixed(2));
        $('#pv-terminal-value').text(pvTerminalValue.toFixed(2));
        $('#total-pv-fcf').text(totalPVFCF.toFixed(2));
        $('#enterprise-value').text(enterpriseValue.toFixed(2));
        $('#intrinsic-value').text(intrinsicValue.toFixed(2));
        $('#margin-safety').text(marginSafety.toFixed(2));
        
        $('#results').slideDown();
    });
});
