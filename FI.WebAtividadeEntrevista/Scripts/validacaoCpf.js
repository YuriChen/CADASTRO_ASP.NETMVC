// validacaoCpf.js
$(document).ready(function () {

    // ========== FUNÇÕES GLOBAIS REUTILIZÁVEIS ==========

    // Função de validação de CPF (já existente)
    window.validarCPF = function (cpf) {
        cpf = cpf.replace(/[^\d]/g, '');

        if (cpf.length !== 11) return false;
        if (/^(\d)\1{10}$/.test(cpf)) return false;

        var soma = 0;
        var resto;

        for (var i = 1; i <= 9; i++) {
            soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(9, 10))) return false;

        soma = 0;
        for (var i = 1; i <= 10; i++) {
            soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(10, 11))) return false;

        return true;
    };

    // Função para aplicar validação a um campo CPF
    window.aplicarValidacaoCPF = function (seletor, options) {
        var defaults = {
            botaoSalvar: null,           // Seletor do botão que deve ser desabilitado
            mensagemErroInvalido: 'CPF inválido! Verifique os dígitos.',
            mensagemErroIncompleto: 'CPF incompleto! Digite os 11 números.',
            mensagemErroObrigatorio: 'CPF é obrigatório!',
            mensagemSubmit: 'Corrija o CPF antes de salvar.',
            placeholder: '423.581.978-07',
            validarAoDigitar: true,
            validarAoBlur: true
        };

        var config = $.extend(defaults, options);
        var campoCPF = $(seletor);

        if (campoCPF.length === 0) return;

        // Aplica a máscara
        campoCPF.mask('000.000.000-00', {
            placeholder: config.placeholder
        });

        // Função para verificar se o CPF é válido
        function isCPFValido() {
            var cpf = campoCPF.val();
            var cpfLimpo = cpf.replace(/[^\d]/g, '');
            return (cpfLimpo.length === 11 && window.validarCPF(cpf));
        }

        // Função para habilitar/desabilitar botão
        function atualizarBotaoSalvar() {
            if (config.botaoSalvar && $(config.botaoSalvar).length) {
                if (isCPFValido()) {
                    $(config.botaoSalvar).prop('disabled', false);
                    $(config.botaoSalvar).css('opacity', '1');
                } else {
                    $(config.botaoSalvar).prop('disabled', true);
                    $(config.botaoSalvar).css('opacity', '0.5');
                }
            }
        }

        // Função para limpar erro
        function limparErro() {
            campoCPF.removeClass('cpf-erro');
            campoCPF.css('border-color', '');
            campoCPF.css('background-color', '');
            campoCPF.next('.cpf-mensagem-erro').remove();
        }

        // Função para mostrar erro
        function mostrarErro(mensagem) {
            limparErro();
            campoCPF.addClass('cpf-erro');
            campoCPF.after('<div class="cpf-mensagem-erro">' + mensagem + '</div>');
            atualizarBotaoSalvar();
        }

        // Validação DURANTE a digitação
        if (config.validarAoDigitar) {
            campoCPF.on('input', function () {
                var cpf = campoCPF.val();
                var cpfLimpo = cpf.replace(/[^\d]/g, '');

                if (cpfLimpo.length === 11) {
                    if (!window.validarCPF(cpf)) {
                        mostrarErro(config.mensagemErroInvalido);
                    } else {
                        limparErro();
                        atualizarBotaoSalvar();
                    }
                } else {
                    limparErro();
                    atualizarBotaoSalvar();
                }
            });
        }

        // Validação ao SAIR do campo (blur)
        if (config.validarAoBlur) {
            campoCPF.on('blur', function () {
                var cpf = campoCPF.val();
                var cpfLimpo = cpf.replace(/[^\d]/g, '');

                if (!cpfLimpo) {
                    mostrarErro(config.mensagemErroObrigatorio);
                    return;
                }

                if (cpfLimpo.length < 11) {
                    mostrarErro(config.mensagemErroIncompleto);
                    return;
                }

                if (!window.validarCPF(cpf)) {
                    mostrarErro(config.mensagemErroInvalido);
                    return;
                }

                limparErro();
                atualizarBotaoSalvar();
            });
        }

        // Ao entrar no campo, limpa erro
        campoCPF.on('focus', function () {
            limparErro();
        });

        // Retorna funções úteis para uso externo
        return {
            isValido: isCPFValido,
            limpar: limparErro,
            campo: campoCPF
        };
    };

    // ========== APLICA VALIDAÇÃO AOS CAMPOS ==========

    // Validação do campo CPF principal (da tela de cliente)
    if ($('#Cpf').length) {
        var botaoSalvarCliente = $('#formCadastro button[type="submit"]');
        window.cpfCliente = aplicarValidacaoCPF('#Cpf', {
            botaoSalvar: botaoSalvarCliente,
            placeholder: '423.581.978-07'
        });

        // Impede o envio do formulário principal se CPF inválido
        $('#formCadastro').on('submit', function (e) {
            if (window.cpfCliente && !window.cpfCliente.isValido()) {
                e.preventDefault();
                window.cpfCliente.campo.focus();
                return false;
            }
            return true;
        });
    }

    // Validação do campo CPF do beneficiário (popup)
    if ($('#CpfBen').length) {
        window.cpfBeneficiario = aplicarValidacaoCPF('#CpfBen', {
            validarAoDigitar: true,
            validarAoBlur: true,
            mensagemErroInvalido: 'CPF do beneficiário inválido!',
            mensagemErroIncompleto: 'CPF do beneficiário incompleto!',
            mensagemErroObrigatorio: 'CPF do beneficiário é obrigatório!',
            placeholder: '999.999.999-99'
            // Não tem botão associado
        });
    }
});