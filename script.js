function generateJSON() {
    const emotions = Array.from(document.querySelectorAll('.emotion'))
        .map(input => input.value)
        .filter(val => val.trim() !== '');

    const effects = Array.from(document.querySelectorAll('.effect'))
        .map(input => input.value)
        .filter(val => val.trim() !== '');

    const jsonData = {
        "目标": document.getElementById('goal').value,
        "主体": {
            "性别": document.getElementById('gender').value,
            "年龄": document.getElementById('age').value,
            "外观": {
                "头发": document.getElementById('hair').value,
                "表情": document.getElementById('expression').value,
                "眼神": document.getElementById('eyes').value,
                "其他特征": document.getElementById('otherFeatures').value
            },
            "服装": {
                "主要服装": document.getElementById('mainClothing').value,
                "配饰": document.getElementById('accessories').value,
                "风格": document.getElementById('clothingStyle').value
            },
            "焦点": document.getElementById('focus').value
        },
        "场景描述": {
            "设置": document.getElementById('setting').value,
            "背景元素": {
                "描述": document.getElementById('bgDescription').value,
                "动感": document.getElementById('motion').value,
                "对比": document.getElementById('contrast').value
            },
            "氛围": {
                "情绪": emotions.length > 0 ? emotions : ["", "", ""],
                "叙事": document.getElementById('narrative').value
            }
        },
        "灯光与色彩": {
            "灯光": document.getElementById('lighting').value,
            "色彩分级": document.getElementById('colorGrading').value,
            "景深": document.getElementById('depthOfField').value
        },
        "视觉风格": {
            "美学": document.getElementById('aesthetics').value,
            "质量": document.getElementById('quality').value,
            "效果": effects.length > 0 ? effects : ["", "", ""]
        },
        "输出要求": {
            "格式": document.getElementById('format').value,
            "方向": document.getElementById('orientation').value,
            "比例": document.getElementById('ratio').value,
            "质量": document.getElementById('outputQuality').value
        }
    };

    return jsonData;
}

function syntaxHighlight(json) {
    json = JSON.stringify(json, null, 2);
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        let cls = 'json-number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'json-key';
            } else {
                cls = 'json-string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'json-boolean';
        } else if (/null/.test(match)) {
            cls = 'json-null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function updatePreview() {
    const jsonData = generateJSON();
    const highlighted = syntaxHighlight(jsonData);
    document.getElementById('jsonOutput').innerHTML = highlighted;
}

function copyToClipboard() {
    const jsonData = generateJSON();
    const jsonString = JSON.stringify(jsonData, null, 2);

    navigator.clipboard.writeText(jsonString).then(() => {
        const btn = document.getElementById('copyBtn');
        btn.textContent = '已复制!';
        btn.classList.add('copied');

        setTimeout(() => {
            btn.textContent = '复制';
            btn.classList.remove('copied');
        }, 2000);
    });
}

function addEmotion() {
    const container = document.getElementById('emotionsContainer');
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'emotion';
    input.placeholder = '添加情感';
    input.addEventListener('input', updatePreview);
    container.appendChild(input);
}

function addEffect() {
    const container = document.getElementById('effectsContainer');
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'effect';
    input.placeholder = '添加效果';
    input.addEventListener('input', updatePreview);
    container.appendChild(input);
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('promptForm');
    const inputs = form.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
        input.addEventListener('input', updatePreview);
        input.addEventListener('change', updatePreview);
    });

    updatePreview();
});
