#!/usr/bin/env node
import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as path from 'path';

async function run() {
    try {
        const source = core.getInput('source', { required: true });
        const destination = core.getInput('destination', { required: true });
        const sourceguardianPath = core.getInput('sourceguardian_path');
        const phpversions = core.getMultilineInput('phpversion');
        const expire = core.getInput('expire');
        const domains = core.getMultilineInput('domain');
        const domainEncrypt = core.getInput('domain-encrypt');
        const domainIgnoreCli = core.getBooleanInput('domain-ignore-cli');
        const ips = core.getMultilineInput('ip');
        const ipEncrypt = core.getInput('ip-encrypt');
        const ipIgnoreCli = core.getBooleanInput('ip-ignore-cli');
        const macs = core.getMultilineInput('mac');
        const machineIds = core.getMultilineInput('machine-id');
        const machineIdEncrypt = core.getInput('machine-id-encrypt');
        const remoteVerificationUrl = core.getInput('remote-verification-url');
        const external = core.getInput('external');
        const conj = core.getBooleanInput('conj');
        const projid = core.getInput('projid');
        const projkey = core.getInput('projkey');
        const timeServer = core.getInput('time-server');
        const consts = core.getMultilineInput('const');
        const catches = core.getMultilineInput('catch');
        const autoGlobals = core.getMultilineInput('auto-global');
        const aspTags = core.getBooleanInput('asp-tags');
        const noShortTags = core.getBooleanInput('no-short-tags');
        const prependCode = core.getInput('prepend-code');
        const loaderErrorCode = core.getInput('loader-error-code');
        const noDefaultStarter = core.getBooleanInput('no-default-starter');
        const compressionLevel = core.getInput('compression-level');
        const entangle = core.getInput('entangle');
        const compat = core.getBooleanInput('compat');
        const evalCompatible = core.getBooleanInput('eval-compatible');
        const stopOnError = core.getBooleanInput('stop-on-error');
        const strictErrors = core.getBooleanInput('strict-errors');
        const deprecErrors = core.getBooleanInput('deprec-errors');
        const keepFileDate = core.getBooleanInput('keep-file-date');
        const keepDocComments = core.getBooleanInput('keep-doc-comments');
        const backup = core.getInput('backup');
        const recursive = core.getInput('recursive');
        const filesToExclude = core.getMultilineInput('files_to_exclude');
        const filesToEncode = core.getMultilineInput('files_to_encode');
        const filesToEncodeAsCustom = core.getMultilineInput('files_to_encode_as_custom');
        const filesToCopy = core.getMultilineInput('files_to_copy');
        const encodeNewerThan = core.getInput('encode-newer-than');
        const ignoreSymlinks = core.getBooleanInput('ignore-symlinks');
        const verbose = core.getInput('verbose');
        const dockerSocket = core.getInput('docker-socket');
        const licenseFile = core.getInput('license-file');
        const showLicenseInfo = core.getBooleanInput('show-license-info');
        const licenseRelease = core.getBooleanInput('license-release');
        const licenseDynamic = core.getBooleanInput('license-dynamic');
        const licenseUsername = core.getInput('license-username');
        const licensePassword = core.getInput('license-password');
        if (licenseRelease && licenseDynamic) {
            throw new Error('`license-release` and `license-dynamic` cannot be used together.');
        }
        const hasLockingOptions = domains.length > 0 ||
            domainEncrypt ||
            ips.length > 0 ||
            ipEncrypt ||
            macs.length > 0 ||
            machineIds.length > 0 ||
            machineIdEncrypt;
        if (external && hasLockingOptions) {
            throw new Error('`external` cannot be used with other locking options (domain, ip, mac, machine-id).');
        }
        if (external && (!projid || !projkey)) {
            throw new Error('`projid` and `projkey` are required when using `external`.');
        }
        if ((projid || projkey) && !external) {
            throw new Error('`projid` and `projkey` can only be used with `external`.');
        }
        if (domains.length > 0 && domainEncrypt) {
            throw new Error('`domain` and `domain-encrypt` cannot be used together.');
        }
        if (ips.length > 0 && ipEncrypt) {
            throw new Error('`ip` and `ip-encrypt` cannot be used together.');
        }
        if (machineIds.length > 0 && machineIdEncrypt) {
            throw new Error('`machine-id` and `machine-id-encrypt` cannot be used together.');
        }
        const executable = sourceguardianPath
            ? path.join(sourceguardianPath, 'sourceguardian')
            : 'sourceguardian';
        let versionOutput = '';
        await exec.exec(executable, ['-v'], {
            listeners: {
                stdout: (data) => {
                    versionOutput += data.toString();
                }
            }
        });
        core.setOutput('sourceguardian_version', versionOutput.trim());
        const args = [];
        phpversions.forEach((version) => {
            args.push('--phpversion', version);
        });
        if (expire) {
            args.push('--expire', expire);
        }
        domains.forEach((domain) => {
            args.push('--domain', domain);
        });
        if (domainEncrypt) {
            args.push('--domain-encrypt', domainEncrypt);
        }
        if (domainIgnoreCli) {
            args.push('--domain-ignore-cli');
        }
        ips.forEach((ip) => {
            args.push('--ip', ip);
        });
        if (ipEncrypt) {
            args.push('--ip-encrypt', ipEncrypt);
        }
        if (ipIgnoreCli) {
            args.push('--ip-ignore-cli');
        }
        macs.forEach((mac) => {
            args.push('--mac', mac);
        });
        machineIds.forEach((id) => {
            args.push('--machine-id', id);
        });
        if (machineIdEncrypt) {
            args.push('--machine-id-encrypt', machineIdEncrypt);
        }
        if (remoteVerificationUrl) {
            args.push('--remote-verification-url', remoteVerificationUrl);
        }
        if (external) {
            args.push('--external', external);
        }
        if (conj) {
            args.push('--conj');
        }
        if (projid) {
            args.push('--projid', projid);
        }
        if (projkey) {
            args.push('--projkey', projkey);
            core.setSecret(projkey);
        }
        if (timeServer) {
            args.push('--time-server', timeServer);
        }
        consts.forEach((c) => {
            args.push('--const', c);
        });
        catches.forEach((c) => {
            args.push('--catch', c);
        });
        autoGlobals.forEach((ag) => {
            args.push('--auto-global', ag);
        });
        if (aspTags) {
            args.push('--asp-tags');
        }
        if (noShortTags) {
            args.push('--no-short-tags');
        }
        if (prependCode) {
            args.push('-p', prependCode);
        }
        if (loaderErrorCode) {
            args.push('-j', loaderErrorCode);
        }
        if (noDefaultStarter) {
            args.push('-n');
        }
        if (compressionLevel) {
            args.push(`-z${compressionLevel}`);
        }
        if (entangle) {
            args.push('--entangle', entangle);
        }
        if (compat) {
            args.push('--compat');
        }
        if (evalCompatible) {
            args.push('--eval-compatible');
        }
        if (stopOnError) {
            args.push('--stop-on-error');
        }
        if (strictErrors) {
            args.push('--strict-errors');
        }
        if (deprecErrors) {
            args.push('--deprec-errors');
        }
        if (keepFileDate) {
            args.push('--keep-file-date');
        }
        if (keepDocComments) {
            args.push('--keep-doc-comments');
        }
        if (backup) {
            if (backup.toLowerCase() === 'false') {
                args.push('-b-');
            }
            else {
                args.push('-b', backup);
            }
        }
        if (recursive.toLowerCase() !== 'false') {
            const stripCount = parseInt(recursive, 10);
            if (!isNaN(stripCount) && stripCount > 0) {
                args.push(`-r${stripCount}`);
            }
            else {
                args.push('-r');
            }
        }
        filesToExclude.forEach((mask) => {
            args.push('-x', mask);
        });
        filesToEncode.forEach((mask) => {
            args.push('-f', mask);
        });
        filesToEncodeAsCustom.forEach((mask) => {
            args.push('-t', mask);
        });
        filesToCopy.forEach((mask) => {
            args.push('-c', mask);
        });
        args.push('-o', destination);
        if (encodeNewerThan) {
            args.push('-a', encodeNewerThan);
        }
        if (ignoreSymlinks) {
            args.push('--ignore-symlinks');
        }
        if (verbose) {
            args.push('--verbose', verbose);
        }
        if (dockerSocket) {
            args.push('--docker-socket', dockerSocket);
        }
        if (licenseFile) {
            args.push('--license-file', licenseFile);
        }
        if (licenseDynamic) {
            args.push('--license-dynamic');
        }
        if (licenseUsername) {
            args.push('--license-username', licenseUsername);
        }
        if (licensePassword) {
            args.push('--license-password', licensePassword);
            core.setSecret(licensePassword);
        }
        args.push(source);
        const commandToLog = `${executable} ${args
            .map((arg) => (arg === licensePassword || arg === projkey ? '***' : arg))
            .join(' ')}`;
        core.info(`Executing: ${commandToLog}`);
        await exec.exec(executable, args);
        if (showLicenseInfo) {
            let licenseOutput = '';
            await exec.exec(executable, ['--license'], {
                listeners: {
                    stdout: (data) => {
                        licenseOutput += data.toString();
                    }
                }
            });
            core.setOutput('sourceguardian_license', licenseOutput.trim());
        }
        if (licenseRelease) {
            await exec.exec(executable, ['--license-release']);
        }
    }
    catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
    }
}

run();
//# sourceMappingURL=index.js.map
